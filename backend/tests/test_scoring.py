from app.services.scoring_service import ScoringService


class MockItem:
    def __init__(self, condition="PASS", severity="NONE", item="Check item"):
        self.condition = condition
        self.severity = severity
        self.item = item


class MockIncident:
    def __init__(self, incident_type="ACCIDENT", severity="MINOR"):
        self.incident_type = incident_type
        self.severity = severity


class MockAIFinding:
    def __init__(self, defect_type="SCRATCH", severity="MINOR"):
        self.defect_type = defect_type
        self.severity = severity


def test_perfect_score():
    score = ScoringService.calculate_score(
        has_mileage_rollback=False,
        incident_records=[],
        inspection_items=[MockItem(condition="PASS")],
        ai_findings=[],
        service_record_count=5,
        is_stolen_or_flagged=False,
    )
    assert score.total_score == 100
    assert score.rating == "EXCELLENT"
    assert len(score.deductions) == 0


def test_mileage_rollback_deduction():
    score = ScoringService.calculate_score(
        has_mileage_rollback=True,
        incident_records=[],
        inspection_items=[],
        ai_findings=[],
        service_record_count=3,
    )
    # Rollback deducts 20 points
    assert score.total_score == 80
    assert any(d.category == "ODOMETER" and d.points_deducted == 20 for d in score.deductions)


def test_severe_accident_deduction():
    score = ScoringService.calculate_score(
        has_mileage_rollback=False,
        incident_records=[MockIncident(incident_type="ACCIDENT", severity="SEVERE")],
        inspection_items=[],
        ai_findings=[],
        service_record_count=2,
    )
    # Severe incident deducts 25 points -> 75
    assert score.total_score == 75
    assert any(d.category == "INCIDENT" and d.points_deducted == 25 for d in score.deductions)


def test_critical_inspection_failure():
    score = ScoringService.calculate_score(
        has_mileage_rollback=False,
        incident_records=[],
        inspection_items=[MockItem(condition="FAIL", severity="CRITICAL", item="Brake Master Cylinder")],
        ai_findings=[],
        service_record_count=1,
    )
    # Critical inspection failure deducts 15 points -> 85
    assert score.total_score == 85
    assert any(d.category == "INSPECTION" and d.points_deducted == 15 for d in score.deductions)


def test_compound_damage_and_clamping():
    score = ScoringService.calculate_score(
        has_mileage_rollback=True,  # -20
        incident_records=[
            MockIncident(incident_type="STRUCTURAL_DAMAGE", severity="SEVERE"),  # -25
            MockIncident(incident_type="ACCIDENT", severity="MAJOR"),             # -15
        ],
        inspection_items=[
            MockItem(condition="FAIL", severity="CRITICAL", item="Steering rack"),  # -15
            MockItem(condition="FAIL", severity="HIGH", item="Brake caliper"),      # -15
        ],
        ai_findings=[
            MockAIFinding(defect_type="PANEL_DAMAGE", severity="SEVERE"),           # -10
            MockAIFinding(defect_type="BROKEN_LIGHT", severity="SEVERE"),           # -10
        ],
        service_record_count=0,  # -5
        is_stolen_or_flagged=True,  # -50
    )
    # Total deductions exceed 100, clamped at 0
    assert score.total_score == 0
    assert score.rating == "CRITICAL_RISK"
