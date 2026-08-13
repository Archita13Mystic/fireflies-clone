from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(tags=["action_items"])

@router.post("/api/meetings/{meeting_id}/action-items", response_model=schemas.ActionItemResponse, status_code=status.HTTP_201_CREATED)
def create_action_item(meeting_id: int, action_item: schemas.ActionItemCreate, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    db_item = models.ActionItem(
        meeting_id=meeting_id,
        text=action_item.text,
        assignee=action_item.assignee,
        due_date=action_item.due_date,
        completed=False
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/api/action-items/{action_item_id}", response_model=schemas.ActionItemResponse)
def update_action_item(action_item_id: int, action_item_update: schemas.ActionItemUpdate, db: Session = Depends(get_db)):
    db_item = db.query(models.ActionItem).filter(models.ActionItem.id == action_item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Action item not found")

    if action_item_update.text is not None:
        db_item.text = action_item_update.text
    if action_item_update.assignee is not None:
        db_item.assignee = action_item_update.assignee
    if action_item_update.due_date is not None:
        db_item.due_date = action_item_update.due_date
    if action_item_update.completed is not None:
        db_item.completed = action_item_update.completed

    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/api/action-items/{action_item_id}")
def delete_action_item(action_item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.ActionItem).filter(models.ActionItem.id == action_item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Action item not found")

    db.delete(db_item)
    db.commit()
    return {"deleted": True}
