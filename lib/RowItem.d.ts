import React from "react";
import { Animated as RNAnimated } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { RenderItemParams } from "./index";
declare type RowItemProps<T> = {
  extraData?: any;
  drag: (hoverComponent: React.ReactNode, itemKey: string) => void;
  keyToIndex: Map<string, number>;
  item: T;
  renderItem: (params: RenderItemParams<T>) => React.ReactNode;
  itemKey: string;
  onUnmount: () => void;
  horizontal?: boolean | false;
  deleteItem: (key: string) => void;
  itemProp: any;
  localization: any;
  screenHeight: number;
  draggablePanRef: React.RefObject<PanGestureHandler>;
  activeIndex: Animated.Value<number>;
};
declare class RowItem<T> extends React.PureComponent<RowItemProps<T>> {
  _height: number;
  _dragY: RNAnimated.AnimatedValue;
  state: {
    enabled: boolean;
  };
  constructor(props: RowItemProps<T>);
  drag: () => void;
  componentWillUnmount(): void;
  _onLayout: (props: any) => void;
  _onPanStateChange: (props: any) => void;
  _toogleSnapAnimate: (isDelete: boolean) => void;
  toggleEnabled: (args: readonly number[]) => void;
  render(): JSX.Element;
}
export default RowItem;
