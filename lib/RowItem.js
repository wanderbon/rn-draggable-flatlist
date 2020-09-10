"use strict";
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var react_native_reanimated_1 = __importDefault(
  require("react-native-reanimated")
);
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var block = react_native_reanimated_1.default.block,
  onChange = react_native_reanimated_1.default.onChange,
  call = react_native_reanimated_1.default.call;
var RowItem = /** @class */ (function(_super) {
  __extends(RowItem, _super);
  function RowItem(props) {
    var _this = _super.call(this, props) || this;
    _this.drag = function() {
      var _a = _this.props,
        drag = _a.drag,
        renderItem = _a.renderItem,
        item = _a.item,
        keyToIndex = _a.keyToIndex,
        itemKey = _a.itemKey;
      var hoverComponent = renderItem({
        isActive: true,
        item: item,
        index: keyToIndex.get(itemKey),
        drag: function() {
          return console.log("## attempt to call drag() on hovering component");
        }
      });
      drag(hoverComponent, itemKey);
    };
    _this._onLayout = function(props) {
      var nativeEvent = props.nativeEvent;
      _this._height = nativeEvent.layout.height;
    };
    _this._onPanStateChange = function(props) {
      var nativeEvent = props.nativeEvent;
      var _a = _this.props,
        keyToIndex = _a.keyToIndex,
        itemKey = _a.itemKey;
      var index = keyToIndex.get(itemKey);
      if (index) {
        if (
          (nativeEvent.oldState ===
            react_native_gesture_handler_1.State.ACTIVE &&
            nativeEvent.state === react_native_gesture_handler_1.State.END) ||
          nativeEvent.state === react_native_gesture_handler_1.State.FAILED
        ) {
          _this._toogleSnapAnimate(nativeEvent.translationY <= -200);
        }
      }
    };
    _this._toogleSnapAnimate = function(isDelete) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      var _j = _this.props,
        deleteItem = _j.deleteItem,
        itemProp = _j.itemProp,
        localization = _j.localization,
        screenHeight = _j.screenHeight;
      var isMediaCard =
        itemProp.cardType === "video" || itemProp.cardType === "photo";
      var isUploading =
        isMediaCard &&
        ((_b =
          (_a =
            itemProp === null || itemProp === void 0
              ? void 0
              : itemProp.blocks[0]) === null || _a === void 0
            ? void 0
            : _a.data) === null || _b === void 0
          ? void 0
          : _b.localUri) &&
        ((itemProp.cardType === "photo" &&
          !((_d =
            (_c =
              itemProp === null || itemProp === void 0
                ? void 0
                : itemProp.blocks[0]) === null || _c === void 0
              ? void 0
              : _c.data) === null || _d === void 0
            ? void 0
            : _d.src)) ||
          (itemProp.cardType === "video" &&
            !((_f =
              (_e =
                itemProp === null || itemProp === void 0
                  ? void 0
                  : itemProp.blocks[0]) === null || _e === void 0
                ? void 0
                : _e.data) === null || _f === void 0
              ? void 0
              : _f.link))) &&
        !((_h =
          (_g =
            itemProp === null || itemProp === void 0
              ? void 0
              : itemProp.blocks[0]) === null || _g === void 0
            ? void 0
            : _g.data) === null || _h === void 0
          ? void 0
          : _h.error);
      react_native_1.Animated.timing(_this._dragY, {
        duration: !isUploading && isDelete ? 100 : 300,
        toValue:
          !isUploading && isDelete ? (-screenHeight - _this._height) / 2 : 0,
        easing: react_native_1.Easing.linear,
        useNativeDriver: true
      }).start(function() {
        if (isUploading) {
          react_native_1.Alert.alert(
            localization["delete_imposible"],
            localization["media_not_load_yet"]
          );
        } else if (isDelete) {
          deleteItem(itemProp.key);
        }
      });
    };
    _this.toggleEnabled = function(args) {
      if (args[0] > -1) {
        _this.setState({ enabled: false });
      } else {
        _this.setState({ enabled: true });
      }
    };
    _this._height = 0;
    _this._dragY = new react_native_1.Animated.Value(0);
    _this.state = {
      enabled: true
    };
    return _this;
  }
  RowItem.prototype.componentWillUnmount = function() {
    this.props.onUnmount();
  };
  RowItem.prototype.render = function() {
    var _this = this;
    var _a = this.props,
      renderItem = _a.renderItem,
      item = _a.item,
      keyToIndex = _a.keyToIndex,
      itemKey = _a.itemKey,
      horizontal = _a.horizontal,
      draggablePanRef = _a.draggablePanRef,
      activeIndex = _a.activeIndex;
    var index = keyToIndex.get(itemKey);
    var component = renderItem({
      isActive: false,
      item: item,
      index: index,
      drag: this.drag
    });
    var wrapperStyle = {
      opacity: 1
    };
    var enabled = this.state.enabled;
    return react_1.default.createElement(
      react_native_1.View,
      {
        onLayout: this._onLayout,
        collapsable: false,
        style: {
          opacity: 1,
          flexDirection: horizontal ? "row" : "column"
        }
      },
      react_1.default.createElement(
        react_native_gesture_handler_1.PanGestureHandler,
        {
          enabled: enabled,
          minDeltaY: 50,
          onGestureEvent: react_native_1.Animated.event(
            [
              {
                nativeEvent: {
                  translationX: new react_native_1.Animated.Value(0),
                  translationY: index
                    ? this._dragY
                    : new react_native_1.Animated.Value(0)
                }
              }
            ],
            {
              // listener: this._onGestureEvent,
              useNativeDriver: true
            }
          ),
          onHandlerStateChange: this._onPanStateChange,
          simultaneousHandlers: [draggablePanRef]
        },
        react_1.default.createElement(
          react_native_1.Animated.View,
          {
            style: [
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
            ]
          },
          component
        )
      ),
      react_1.default.createElement(
        react_native_reanimated_1.default.Code,
        null,
        function() {
          return block([
            onChange(activeIndex, call([activeIndex], _this.toggleEnabled))
          ]);
        }
      )
    );
  };
  return RowItem;
})(react_1.default.PureComponent);
exports.default = RowItem;
