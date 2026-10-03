import json
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from prisma import Prisma
from app.schemas.audit import (
    AuditLogResponse,
    SupportTicketCreate,
    SupportTicketResponse,
    SupportTicketStatusUpdate,
)
from app.utils.exceptions import NotFoundException, BadRequestException


class AuditService:
    def __init__(self, db: Prisma):
        self.db = db

    async def log_action(
        self,
        actor_user_id: Optional[str],
        action: str,
        entity_type: str,
        entity_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None
    ) -> None:
        try:
            meta_str = json.dumps(metadata) if metadata else None
            await self.db.auditlog.create(
                data={
                    "actor_user_id": actor_user_id,
                    "action": action.upper(),
                    "entity_type": entity_type.upper(),
                    "entity_id": entity_id,
                    "metadata_json": meta_str,
                    "ip_address": ip_address,
                }
            )
        except Exception:
            # Audit logging should never interrupt primary business transaction
            pass

    async def get_audit_logs(self, limit: int = 100) -> List[AuditLogResponse]:
        logs = await self.db.auditlog.find_many(
            take=limit,
            order={"created_at": "desc"},
        )
        return [AuditLogResponse.model_validate(l) for l in logs]

    async def create_support_ticket(self, user_id: str, ticket_in: SupportTicketCreate) -> SupportTicketResponse:
        ticket = await self.db.supportticket.create(
            data={
                "user_id": user_id,
                "type": ticket_in.type.upper(),
                "subject": ticket_in.subject.strip(),
                "message": ticket_in.message.strip(),
                "status": "OPEN",
            }
        )
        return SupportTicketResponse.model_validate(ticket)

    async def get_user_tickets(self, user_id: str) -> List[SupportTicketResponse]:
        tickets = await self.db.supportticket.find_many(
            where={"user_id": user_id},
            order={"created_at": "desc"},
        )
        return [SupportTicketResponse.model_validate(t) for t in tickets]

    async def list_all_tickets(self) -> List[SupportTicketResponse]:
        tickets = await self.db.supportticket.find_many(
            order={"created_at": "desc"},
        )
        return [SupportTicketResponse.model_validate(t) for t in tickets]

    async def update_ticket_status(self, ticket_id: str, status_in: SupportTicketStatusUpdate) -> SupportTicketResponse:
        ticket = await self.db.supportticket.find_unique(where={"id": ticket_id})
        if not ticket:
            raise NotFoundException("Support ticket", ticket_id)

        updated = await self.db.supportticket.update(
            where={"id": ticket_id},
            data={"status": status_in.status.upper()},  # type: ignore
        )
        return SupportTicketResponse.model_validate(updated)
