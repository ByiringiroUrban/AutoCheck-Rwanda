from typing import List, Dict, Any, Optional
from app.schemas.report import ScoreBreakdown, ScoreDeduction


class ScoringService:
    FORMULA_VERSION = "autocheck-score-v1.0"

    @classmethod
    def calculate_score(
        cls,
        has_mileage_rollback: bool,
        incident_records: List[Any],
        inspection_items: List[Any],
        ai_findings: List[Any],
        service_record_count: int,
        is_stolen_or_flagged: bool = False,
    ) -> ScoreBreakdown:
        base_score = 100
        total_deductions = 0
        deductions: List[ScoreDeduction] = []

        # 1. Critical Stolen / Flagged Status
        if is_stolen_or_flagged:
            deduction = 50
            total_deductions += deduction
            deductions.append(
                ScoreDeduction(
                    category="LEGAL_STATUS",
                    reason="Vehicle status is currently flagged or reported stolen",
                    points_deducted=deduction,
                )
            )

        # 2. Mileage Rollback Anomaly
        if has_mileage_rollback:
            deduction = 20
            total_deductions += deduction
            deductions.append(
                ScoreDeduction(
                    category="ODOMETER",
                    reason="Odometer rollback / tampering anomaly detected in chronological history",
                    points_deducted=deduction,
                )
            )

        # 3. Incident History
        for inc in incident_records:
            severity = str(getattr(inc, "severity", "MINOR")).upper()
            inc_type = str(getattr(inc, "incident_type", "ACCIDENT")).upper()
            if severity == "SEVERE" or inc_type in ["FLOOD_DAMAGE", "FIRE_DAMAGE", "STRUCTURAL_DAMAGE"]:
                ded = 25
                total_deductions += ded
                deductions.append(
                    ScoreDeduction(
                        category="INCIDENT",
                        reason=f"Severe incident record ({inc_type.replace('_', ' ').title()})",
                        points_deducted=ded,
                    )
                )
            elif severity == "MAJOR":
                ded = 15
                total_deductions += ded
                deductions.append(
                    ScoreDeduction(
                        category="INCIDENT",
                        reason=f"Major incident record ({inc_type.replace('_', ' ').title()})",
                        points_deducted=ded,
                    )
                )
            elif severity == "MODERATE":
                ded = 10
                total_deductions += ded
                deductions.append(
                    ScoreDeduction(
                        category="INCIDENT",
                        reason=f"Moderate incident record ({inc_type.replace('_', ' ').title()})",
                        points_deducted=ded,
                    )
                )
            else:
                ded = 5
                total_deductions += ded
                deductions.append(
                    ScoreDeduction(
                        category="INCIDENT",
                        reason=f"Minor recorded incident ({inc_type.replace('_', ' ').title()})",
                        points_deducted=ded,
                    )
                )

        # 4. Inspection Defect Items
        failed_items = [it for it in inspection_items if getattr(it, "condition", "") == "FAIL"]
        for item in failed_items:
            sev = str(getattr(item, "severity", "NONE")).upper()
            item_name = getattr(item, "item", "Inspection point")
            if sev in ["CRITICAL", "HIGH"]:
                ded = 15
                total_deductions += ded
                deductions.append(
                    ScoreDeduction(
                        category="INSPECTION",
                        reason=f"Critical safety defect failed in inspection: {item_name}",
                        points_deducted=ded,
                    )
                )
            else:
                ded = 5
                total_deductions += ded
                deductions.append(
                    ScoreDeduction(
                        category="INSPECTION",
                        reason=f"Inspection defect noted: {item_name}",
                        points_deducted=ded,
                    )
                )

        # 5. AI Detected Exterior Defects
        severe_ai = [f for f in ai_findings if str(getattr(f, "severity", "")).upper() == "SEVERE"]
        moderate_ai = [f for f in ai_findings if str(getattr(f, "severity", "")).upper() == "MODERATE"]
        minor_ai = [f for f in ai_findings if str(getattr(f, "severity", "")).upper() == "MINOR"]

        if severe_ai:
            ded = min(len(severe_ai) * 10, 20)
            total_deductions += ded
            deductions.append(
                ScoreDeduction(
                    category="AI_VISION",
                    reason=f"AI Vision detected {len(severe_ai)} severe exterior body defect(s)",
                    points_deducted=ded,
                )
            )
        if moderate_ai:
            ded = min(len(moderate_ai) * 5, 15)
            total_deductions += ded
            deductions.append(
                ScoreDeduction(
                    category="AI_VISION",
                    reason=f"AI Vision detected {len(moderate_ai)} moderate exterior defect(s)",
                    points_deducted=ded,
                )
            )
        if minor_ai and not severe_ai and not moderate_ai:
            ded = min(len(minor_ai) * 2, 6)
            total_deductions += ded
            deductions.append(
                ScoreDeduction(
                    category="AI_VISION",
                    reason=f"AI Vision detected {len(minor_ai)} cosmetic scratch/dent(s)",
                    points_deducted=ded,
                )
            )

        # 6. Maintenance Coverage
        if service_record_count == 0:
            ded = 5
            total_deductions += ded
            deductions.append(
                ScoreDeduction(
                    category="MAINTENANCE",
                    reason="No verified garage service records recorded yet",
                    points_deducted=ded,
                )
            )

        # Compute final clamped score
        final_score = max(0, min(100, base_score - total_deductions))

        # Rating label
        if final_score >= 90:
            rating = "EXCELLENT"
            summary = "Excellent vehicle history with high reliability indicators and no major risk factors."
        elif final_score >= 75:
            rating = "GOOD"
            summary = "Good vehicle standing with minor wear or isolated non-critical items."
        elif final_score >= 60:
            rating = "FAIR"
            summary = "Fair vehicle condition with notable maintenance, inspection, or minor damage history."
        elif final_score >= 40:
            rating = "POOR"
            summary = "Poor rating due to past major incidents, multiple inspection failures, or unverified claims."
        else:
            rating = "CRITICAL_RISK"
            summary = "Critical risk factors detected, such as odometer rollback, severe structural damage, or legal flags."

        return ScoreBreakdown(
            total_score=final_score,
            rating=rating,
            formula_version=cls.FORMULA_VERSION,
            base_score=base_score,
            deductions=deductions,
            summary=summary,
        )
