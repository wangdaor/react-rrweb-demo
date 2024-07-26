import { create } from "zustand";
import { EventType } from "rrweb";

type State = {
  event: [];
};

const useStore = create((set) => {
  return {
    event: [],
    setEvent(data: EventType) {
      set((state: State) => {
        return { event: [...state.event, data] };
      });
    },
  };
});

export default useStore;
