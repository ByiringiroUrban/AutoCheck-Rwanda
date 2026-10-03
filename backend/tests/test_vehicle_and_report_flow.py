import pytest
from app.services.scoring_service import ScoringService
from app.utils.normalizers import normalize_vin, normalize_plate_number
from app.schemas.report import ScoreBreakdown, VehicleReportSnapshot
from app.schemas.vehicle import VehicleResponse, VehicleTimelineItem
from datetime import datetime, timezone


def test_vehicle_snapshot_serialization():
    vehicle = VehicleResponse(
        id="test-veh-1",
        vin="1HGCR2F83HA123456",
        make="TOYOTA",
        model="RAV4",
        year=2021,
        body_type="SUV",
        fuel_type="PETROL",
        color="SILVER",
        status="ACTIVE",
        created_at=datetime.now(timezone.utc),
        current_plate="RAD 123 A",
        latest_mileage=45000,
    )

    score = ScoringService.calculate_score(
        has_mileage_rollback=False,
        incident_records=[],
        inspection_items=[],
        ai_findings=[],
        service_record_count=3,
    )

    snapshot = VehicleReportSnapshot(
        vehicle=vehicle,
        current_plate="RAD 123 A",
        plate_history=[{"plate_number": "RAD 123 A", "is_current": True}],
        ownership_count=1,
        verified_ownership=True,
        latest_mileage=45000,
        mileage_rollback_warning=False,
        score=score,
        service_history=[],
        inspection_history=[],
        ai_visible_defects=[],
        timeline=[
            VehicleTimelineItem(
                id="tl-1",
                event_type="REGISTRATION",
                date=datetime.now(timezone.utc),
                title="Vehicle Registered",
                description="Registered in Rwanda",
                source_type="SYSTEM",
            )
        ],
        dispute_count=0,
        disclaimer="Standard test disclaimer",
    )

    json_str = snapshot.model_dump_json()
    assert "1HGCR2F83HA123456" in json_str
    assert "RAD 123 A" in json_str
    assert snapshot.score.total_score == 100
    assert snapshot.score.rating == "EXCELLENT"


def test_plate_history_normalization():
    plates = ["rac 100 a", "rad 200 b", "rae 300 c"]
    normalized = [normalize_plate_number(p) for p in plates]
    assert normalized == ["RAC 100 A", "RAD 200 B", "RAE 300 C"]
