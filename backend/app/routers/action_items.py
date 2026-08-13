from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/meetings/{meeting_id}/action-items", tags=["action_items"])

@router.get("", response_model=List[schemas.ActionItemOut])
def get_action_items(meeting_id: int, db: Session = Depends(get_db)):
    return db.query(models.ActionItem).filter(models.ActionItem.meeting_id == meeting_id).all()

@router.post("", response_model=schemas.ActionItemOut, status_code=status.HTTP_201_CREATED)
def create_action_item(meeting_id: int, payload: schemas.ActionItemCreate, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    new_item = models.ActionItem(
        meeting_id=meeting_id,
        text=payload.text,
        assignee=payload.assignee or "Unassigned",
        status=payload.status or "pending",
        due_date=payload.due_date
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.patch("/{item_id}", response_model=schemas.ActionItemOut)
def update_action_item(meeting_id: int, item_id: int, payload: schemas.ActionItemUpdate, db: Session = Depends(get_db)):
    item = db.query(models.ActionItem).filter(
        models.ActionItem.id == item_id,
        models.ActionItem.meeting_id == meeting_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")

    if payload.text is not None:
        item.text = payload.text
    if payload.assignee is not None:
        item.assignee = payload.assignee
    if payload.status is not None:
        item.status = payload.status
    if payload.due_date is not None:
        item.due_date = payload.due_date

    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_action_item(meeting_id: int, item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.ActionItem).filter(
        models.ActionItem.id == item_id,
        models.ActionItem.meeting_id == meeting_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")

    db.delete(item)
    db.commit()
    return None
