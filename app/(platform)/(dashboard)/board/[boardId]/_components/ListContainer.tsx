"use client";
import React, { useEffect, useState } from "react";
import { ListWithCards } from "@/types";
import ListForm from "./ListForm";
import ListItem from "./ListItem";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/updade-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/updade-card-order";
interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const resault = Array.from(list);
  const [removed] = resault.splice(startIndex, 1);
  resault.splice(endIndex, 0, removed);
  return resault;
}
const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);
  useEffect(() => {
    setOrderedData(data);
  }, [data]);
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reordered successfully");
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card reordered successfully");
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const onDragEnd = (resault: any) => {
    const { destination, source, type } = resault;

    if (!destination) return;

    // if dropped in the SAME position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    // if user moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );
      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }
    if (type === "card") {
      let newOrderData = [...orderedData];
      // source and destination list
      const sourceList = newOrderData.find(
        (list) => list.id === source.droppableId
      );
      const destinationList = newOrderData.find(
        (list) => list.id === destination.droppableId
      );
      if (!sourceList || !destinationList) return;
      // check if card exists in sourceList
      if (!sourceList.cards) {
        sourceList.cards = [];
      }
      if (!destinationList.cards) {
        destinationList.cards = [];
      }
      // moving card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );
        reorderedCards.forEach((card, index) => {
          card.order = index;
        });
        sourceList.cards = reorderedCards;
        setOrderedData(newOrderData);
        executeUpdateCardOrder({ boardId: boardId, items: reorderedCards });
      } else {
        const [movedCard] = sourceList.cards.splice(source.index, 1);
        // assign the new listId to the moved card
        movedCard.listId = destination.droppableId;
        // add card to the destination list
        destinationList.cards.splice(destination.index, 0, movedCard);
        sourceList.cards.forEach((card, index) => (card.order = index));
        // update the order for each card in  the destination list
        destinationList.cards.forEach((card, index) => {
          card.order = index;
        });
        setOrderedData(newOrderData);
        executeUpdateCardOrder({
          boardId: boardId,
          items: destinationList.cards,
        });
      }
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
