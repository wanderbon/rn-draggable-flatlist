import React from "react";
import {
  Animated as RNAnimated,
  Easing as RNEasing,
  Alert,
  View
} from "react-native";
import Animated from "react-native-reanimated";
import {
  PanGestureHandler,
  State as GestureState
} from "react-native-gesture-handler";
import { RenderItemParams } from "./index";

const { block, onChange, call } = Animated;

type RowItemProps<T> = {
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

class RowItem<T> extends React.PureComponent<RowItemProps<T>> {
  _height: number;
  _dragY: RNAnimated.AnimatedValue;
  state: {
    enabled: boolean;
  };

  constructor(props: RowItemProps<T>) {
    super(props);

    this._height = 0;
    this._dragY = new RNAnimated.Value(0);
    this.state = {
      enabled: true
    };
  }

  drag = () => {
    const { drag, renderItem, item, keyToIndex, itemKey } = this.props;

    const hoverComponent = renderItem({
      isActive: true,
      item,
      index: keyToIndex.get(itemKey),
      drag: () => console.log("## attempt to call drag() on hovering component")
    });

    drag(hoverComponent, itemKey);
  };

  componentWillUnmount() {
    this.props.onUnmount();
  }

  _onLayout = (props: any) => {
    const { nativeEvent } = props;

    this._height = nativeEvent.layout.height;
  };

  _onPanStateChange = (props: any) => {
    const { nativeEvent } = props;
    const { keyToIndex, itemKey } = this.props;

    const index = keyToIndex.get(itemKey);

    if (index) {
      if (
        (nativeEvent.oldState === GestureState.ACTIVE &&
          nativeEvent.state === GestureState.END) ||
        nativeEvent.state === GestureState.FAILED
      ) {
        this._toogleSnapAnimate(nativeEvent.translationY <= -200);
      }
    }
  };

  _toogleSnapAnimate = (isDelete: boolean) => {
    const { deleteItem, itemProp, localization, screenHeight } = this.props;

    const isMediaCard =
      itemProp.cardType === "video" || itemProp.cardType === "photo";

    const isUploading =
      isMediaCard &&
      itemProp?.blocks[0]?.data?.localUri &&
      ((itemProp.cardType === "photo" && !itemProp?.blocks[0]?.data?.src) ||
        (itemProp.cardType === "video" && !itemProp?.blocks[0]?.data?.link)) &&
      !itemProp?.blocks[0]?.data?.error;

    RNAnimated.timing(this._dragY, {
      duration: !isUploading && isDelete ? 100 : 300,
      toValue:
        !isUploading && isDelete ? (-screenHeight - this._height) / 2 : 0,
      easing: RNEasing.linear,
      useNativeDriver: true
    }).start(() => {
      if (isUploading) {
        Alert.alert(
          localization["delete_imposible"],
          localization["media_not_load_yet"]
        );
      } else if (isDelete) {
        deleteItem(itemProp.key);
      }
    });
  };

  toggleEnabled = (args: readonly number[]) => {
    if (args[0] > -1) {
      this.setState({ enabled: false });
    } else {
      this.setState({ enabled: true });
    }
  };

  render() {
    const {
      renderItem,
      item,
      keyToIndex,
      itemKey,
      horizontal,
      draggablePanRef,
      activeIndex
    } = this.props;

    const index = keyToIndex.get(itemKey);

    const component = renderItem({
      isActive: false,
      item,
      index,
      drag: this.drag
    });

    let wrapperStyle: { opacity: number; width?: number; height?: number } = {
      opacity: 1
    };

    const { enabled } = this.state;

    return (
      <View
        onLayout={this._onLayout}
        collapsable={false}
        style={{
          opacity: 1,
          flexDirection: horizontal ? "row" : "column"
        }}
      >
        <PanGestureHandler
          enabled={enabled}
          minDeltaY={50}
          onGestureEvent={RNAnimated.event(
            [
              {
                nativeEvent: {
                  translationX: new RNAnimated.Value(0),
                  translationY: index ? this._dragY : new RNAnimated.Value(0)
                }
              }
            ],
            {
              // listener: this._onGestureEvent,
              useNativeDriver: true
            }
          )}
          onHandlerStateChange={this._onPanStateChange}
          simultaneousHandlers={[draggablePanRef]}
        >
          <RNAnimated.View
            style={[
              wrapperStyle,
              {
                transform: [
                  {
                    translateX: 0
                  },
                  {
                    translateY: this._dragY
                  }
                ]
              }
            ]}
          >
            {component}
          </RNAnimated.View>
        </PanGestureHandler>
        <Animated.Code>
          {() =>
            block([
              onChange(activeIndex, call([activeIndex], this.toggleEnabled))
            ])
          }
        </Animated.Code>
      </View>
    );
  }
}

export default RowItem;
