import { ReactNode } from "react";

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;

  children: ReactNode;

  height?: number;

  closeOnBackdropPress?: boolean;

  closeOnDragDown?: boolean;

  showCloseIcon?: boolean;

  animationDuration?: number;
}
