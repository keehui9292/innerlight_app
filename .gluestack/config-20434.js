var config = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/@gluestack-ui/config/src/theme/index.ts
  var theme_exports = {};
  __export(theme_exports, {
    Accordion: () => Accordion,
    AccordionContent: () => AccordionContent,
    AccordionContentText: () => AccordionContentText,
    AccordionHeader: () => AccordionHeader,
    AccordionIcon: () => AccordionIcon,
    AccordionItem: () => AccordionItem,
    AccordionTitleText: () => AccordionTitleText,
    AccordionTrigger: () => AccordionTrigger,
    Actionsheet: () => Actionsheet,
    ActionsheetBackdrop: () => ActionsheetBackdrop,
    ActionsheetContent: () => ActionsheetContent,
    ActionsheetDragIndicator: () => ActionsheetDragIndicator,
    ActionsheetFlatList: () => ActionsheetFlatList,
    ActionsheetIcon: () => ActionsheetIcon,
    ActionsheetIndicatorWrapper: () => ActionsheetIndicatorWrapper,
    ActionsheetItem: () => ActionsheetItem,
    ActionsheetItemText: () => ActionsheetItemText,
    ActionsheetScrollView: () => ActionsheetScrollView,
    ActionsheetSectionHeaderText: () => ActionsheetSectionHeaderText,
    ActionsheetSectionList: () => ActionsheetSectionList,
    ActionsheetVirtualizedList: () => ActionsheetVirtualizedList,
    Alert: () => Alert,
    AlertDialog: () => AlertDialog,
    AlertDialogBackdrop: () => AlertDialogBackdrop,
    AlertDialogBody: () => AlertDialogBody,
    AlertDialogCloseButton: () => AlertDialogCloseButton,
    AlertDialogContent: () => AlertDialogContent,
    AlertDialogFooter: () => AlertDialogFooter,
    AlertDialogHeader: () => AlertDialogHeader,
    AlertIcon: () => AlertIcon,
    AlertText: () => AlertText,
    Avatar: () => Avatar,
    AvatarBadge: () => AvatarBadge,
    AvatarFallbackText: () => AvatarFallbackText,
    AvatarGroup: () => AvatarGroup,
    AvatarImage: () => AvatarImage,
    Badge: () => Badge,
    BadgeIcon: () => BadgeIcon,
    BadgeText: () => BadgeText,
    BaseIcon: () => BaseIcon,
    Box: () => Box,
    Button: () => Button,
    ButtonGroup: () => ButtonGroup,
    ButtonGroupHSpacer: () => ButtonGroupHSpacer,
    ButtonGroupVSpacer: () => ButtonGroupVSpacer,
    ButtonIcon: () => ButtonIcon,
    ButtonSpinner: () => ButtonSpinner,
    ButtonText: () => ButtonText,
    Card: () => Card,
    Center: () => Center,
    Checkbox: () => Checkbox,
    CheckboxGroup: () => CheckboxGroup,
    CheckboxIcon: () => CheckboxIcon,
    CheckboxIndicator: () => CheckboxIndicator,
    CheckboxLabel: () => CheckboxLabel,
    Divider: () => Divider,
    Fab: () => Fab,
    FabIcon: () => FabIcon,
    FabLabel: () => FabLabel,
    FlatList: () => FlatList,
    FormControl: () => FormControl,
    FormControlError: () => FormControlError,
    FormControlErrorIcon: () => FormControlErrorIcon,
    FormControlErrorText: () => FormControlErrorText,
    FormControlHelper: () => FormControlHelper,
    FormControlHelperText: () => FormControlHelperText,
    FormControlLabel: () => FormControlLabel,
    FormControlLabelText: () => FormControlLabelText,
    HStack: () => HStack,
    Heading: () => Heading,
    Icon: () => Icon,
    Image: () => Image,
    ImageBackground: () => ImageBackground,
    Input: () => Input,
    InputAccessoryView: () => InputAccessoryView,
    InputField: () => InputField,
    InputIcon: () => InputIcon,
    InputSlot: () => InputSlot,
    KeyboardAvoidingView: () => KeyboardAvoidingView,
    Link: () => Link,
    LinkText: () => LinkText,
    Menu: () => Menu,
    MenuBackdrop: () => MenuBackdrop,
    MenuItem: () => MenuItem,
    MenuLabel: () => MenuLabel,
    MenuSeparator: () => MenuSeparator,
    Modal: () => Modal,
    ModalBackdrop: () => ModalBackdrop,
    ModalBody: () => ModalBody,
    ModalCloseButton: () => ModalCloseButton,
    ModalContent: () => ModalContent,
    ModalFooter: () => ModalFooter,
    ModalHeader: () => ModalHeader,
    Popover: () => Popover,
    PopoverArrow: () => PopoverArrow,
    PopoverBackdrop: () => PopoverBackdrop,
    PopoverBody: () => PopoverBody,
    PopoverCloseButton: () => PopoverCloseButton,
    PopoverContent: () => PopoverContent,
    PopoverFooter: () => PopoverFooter,
    PopoverHeader: () => PopoverHeader,
    Pressable: () => Pressable,
    Progress: () => Progress,
    ProgressFilledTrack: () => ProgressFilledTrack,
    Radio: () => Radio,
    RadioGroup: () => RadioGroup,
    RadioIcon: () => RadioIcon,
    RadioIndicator: () => RadioIndicator,
    RadioLabel: () => RadioLabel,
    RefreshControl: () => RefreshControl,
    SafeAreaView: () => SafeAreaView,
    ScrollView: () => ScrollView,
    SectionList: () => SectionList,
    Select: () => Select,
    SelectActionsheet: () => SelectActionsheet,
    SelectActionsheetBackdrop: () => SelectActionsheetBackdrop,
    SelectActionsheetContent: () => SelectActionsheetContent,
    SelectActionsheetDragIndicator: () => SelectActionsheetDragIndicator,
    SelectActionsheetFlatList: () => SelectActionsheetFlatList,
    SelectActionsheetIcon: () => SelectActionsheetIcon,
    SelectActionsheetIndicatorWrapper: () => SelectActionsheetIndicatorWrapper,
    SelectActionsheetItem: () => SelectActionsheetItem,
    SelectActionsheetItemText: () => SelectActionsheetItemText,
    SelectActionsheetScrollView: () => SelectActionsheetScrollView,
    SelectActionsheetSectionHeaderText: () => SelectActionsheetSectionHeaderText,
    SelectActionsheetSectionList: () => SelectActionsheetSectionList,
    SelectActionsheetVirtualizedList: () => SelectActionsheetVirtualizedList,
    SelectIcon: () => SelectIcon,
    SelectInput: () => SelectInput,
    SelectTrigger: () => SelectTrigger,
    Slider: () => Slider,
    SliderFilledTrack: () => SliderFilledTrack,
    SliderThumb: () => SliderThumb,
    SliderThumbInteraction: () => SliderThumbInteraction,
    SliderTrack: () => SliderTrack,
    Spinner: () => Spinner,
    StatusBar: () => StatusBar,
    Switch: () => Switch,
    Tabs: () => Tabs,
    TabsTab: () => TabsTab,
    TabsTabIcon: () => TabsTabIcon,
    TabsTabList: () => TabsTabList,
    TabsTabPanel: () => TabsTabPanel,
    TabsTabPanels: () => TabsTabPanels,
    TabsTabTitle: () => TabsTabTitle,
    Text: () => Text,
    Textarea: () => Textarea,
    TextareaInput: () => TextareaInput,
    Toast: () => Toast,
    ToastDescription: () => ToastDescription,
    ToastTitle: () => ToastTitle,
    Tooltip: () => Tooltip,
    TooltipContent: () => TooltipContent,
    TooltipText: () => TooltipText,
    VStack: () => VStack,
    View: () => View,
    VirtualizedList: () => VirtualizedList
  });

  // node_modules/@gluestack-ui/config/src/theme/Actionsheet.ts
  var import_react = __require("./mock-20434.js");
  var Actionsheet = (0, import_react.createStyle)({
    width: "$full",
    height: "$full",
    _web: {
      pointerEvents: "none"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Accordion.ts
  var import_react2 = __require("./mock-20434.js");
  var Accordion = (0, import_react2.createStyle)({
    width: "$full",
    _icon: {
      color: "$textLight900",
      _dark: {
        color: "$textDark50"
      }
    },
    _titleText: {
      color: "$textLight900",
      _dark: {
        color: "$textDark50"
      }
    },
    _contentText: {
      color: "$textLight700",
      _dark: {
        color: "$textDark200"
      }
    },
    variants: {
      size: {
        sm: {
          _titleText: {
            fontSize: "$sm",
            fontFamily: "$body",
            fontWeight: "$bold",
            lineHeight: "$sm"
          },
          _contentText: {
            fontSize: "$sm",
            fontFamily: "$body",
            fontWeight: "$normal",
            lineHeight: "$sm"
          }
        },
        md: {
          _titleText: {
            fontSize: "$md",
            fontFamily: "$body",
            fontWeight: "$bold",
            lineHeight: "$md"
          },
          _contentText: {
            fontSize: "$md",
            fontFamily: "$body",
            fontWeight: "$normal",
            lineHeight: "$md"
          }
        },
        lg: {
          _titleText: {
            fontSize: "$lg",
            fontFamily: "$body",
            fontWeight: "$bold",
            lineHeight: "$lg"
          },
          _contentText: {
            fontSize: "$lg",
            fontFamily: "$body",
            fontWeight: "$normal",
            lineHeight: "$lg"
          }
        }
      },
      variant: {
        filled: {
          backgroundColor: "$white",
          _item: {
            backgroundColor: "$backgroundLight0"
          },
          shadowColor: "$backgroundLight900",
          shadowOffset: {
            width: 0,
            height: 3
          },
          shadowRadius: 8,
          shadowOpacity: 0.2,
          elevation: 10,
          _dark: {
            backgroundColor: "transparent",
            _item: {
              backgroundColor: "$backgroundDark950"
            }
          }
        },
        unfilled: {
          shadowColor: "transparent",
          shadowOffset: {
            width: 0,
            height: 0
          },
          _item: {
            backgroundColor: "transparent"
          },
          _dark: {
            _item: {
              backgroundColor: "transparent"
            }
          }
        }
      }
    },
    defaultProps: {
      theme: "light",
      size: "md",
      variant: "filled"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/AccordionItem.ts
  var import_react3 = __require("./mock-20434.js");
  var AccordionItem = (0, import_react3.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/AccordionHeader.ts
  var import_react4 = __require("./mock-20434.js");
  var AccordionHeader = (0, import_react4.createStyle)({
    mx: "$0",
    my: "$0"
  });

  // node_modules/@gluestack-ui/config/src/theme/AccordionTrigger.ts
  var import_react5 = __require("./mock-20434.js");
  var AccordionTrigger = (0, import_react5.createStyle)({
    "width": "$full",
    "py": "$5",
    "px": "$5",
    "flexDirection": "row",
    "justifyContent": "space-between",
    "alignItems": "center",
    "_web": {
      outlineWidth: 0
    },
    ":disabled": {
      opacity: 0.4,
      _web: {
        cursor: "not-allowed"
      }
    },
    ":focusVisible": {
      _light: {
        bg: "$backgroundLight50"
      },
      _dark: {
        bg: "$backgroundDark900"
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/AccordionTitleText.ts
  var import_react6 = __require("./mock-20434.js");
  var AccordionTitleText = (0, import_react6.createStyle)({
    flex: 1,
    textAlign: "left"
  });

  // node_modules/@gluestack-ui/config/src/theme/AccordionIcon.ts
  var import_react7 = __require("./mock-20434.js");
  var AccordionIcon = (0, import_react7.createStyle)({
    props: {
      size: "md"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/AccordionContent.ts
  var import_react8 = __require("./mock-20434.js");
  var AccordionContent = (0, import_react8.createStyle)({
    px: "$5",
    mt: "$2",
    pb: "$5"
  });

  // node_modules/@gluestack-ui/config/src/theme/AccordionContentText.ts
  var import_react9 = __require("./mock-20434.js");
  var AccordionContentText = (0, import_react9.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/ActionsheetBackdrop.ts
  var import_react10 = __require("./mock-20434.js");
  var ActionsheetBackdrop = (0, import_react10.createStyle)({
    ":initial": {
      opacity: 0
    },
    ":animate": {
      opacity: 0.5
    },
    ":exit": {
      opacity: 0
    },
    "position": "absolute",
    "left": 0,
    "top": 0,
    "right": 0,
    "bottom": 0,
    "bg": "$backgroundLight950",
    // @ts-ignore
    "_dark": {
      bg: "$backgroundDark950"
    },
    // @ts-ignore
    "_web": {
      cursor: "default",
      pointerEvents: "auto"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ActionsheetContent.ts
  var import_react11 = __require("./mock-20434.js");
  var ActionsheetContent = (0, import_react11.createStyle)({
    alignItems: "center",
    borderTopLeftRadius: "$3xl",
    borderTopRightRadius: "$3xl",
    h: "$full",
    p: "$2",
    bg: "$backgroundLight0",
    _sectionHeaderBackground: {
      bg: "$backgroundLight0"
    },
    _dark: {
      bg: "$backgroundDark900",
      _sectionHeaderBackground: {
        bg: "$backgroundDark900"
      }
    },
    defaultProps: {
      hardShadow: "5"
    },
    _web: {
      userSelect: "none",
      pointerEvents: "auto"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ActionsheetDragIndicator.ts
  var import_react12 = __require("./mock-20434.js");
  var ActionsheetDragIndicator = (0, import_react12.createStyle)({
    height: "$1",
    width: "$16",
    bg: "$backgroundLight400",
    rounded: "$full",
    _dark: {
      bg: "$backgroundDark500"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ActionsheetFlatList.ts
  var import_react13 = __require("./mock-20434.js");
  var ActionsheetFlatList = (0, import_react13.createStyle)({
    w: "$full",
    h: "auto"
  });

  // node_modules/@gluestack-ui/config/src/theme/ActionsheetIcon.ts
  var import_react14 = __require("./mock-20434.js");
  var ActionsheetIcon = (0, import_react14.createStyle)({
    props: {
      size: "sm"
    },
    color: "$backgroundLight500",
    _dark: {
      //@ts-ignore
      color: "$backgroundDark400"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ActionsheetIndicatorWrapper.ts
  var import_react15 = __require("./mock-20434.js");
  var ActionsheetIndicatorWrapper = (0, import_react15.createStyle)({
    py: "$1",
    w: "$full",
    alignItems: "center"
  });

  // node_modules/@gluestack-ui/config/src/theme/ActionsheetItem.ts
  var import_react16 = __require("./mock-20434.js");
  var ActionsheetItem = (0, import_react16.createStyle)({
    "p": "$3",
    "flexDirection": "row",
    "alignItems": "center",
    "rounded": "$sm",
    "w": "$full",
    ":disabled": {
      opacity: 0.4,
      _web: {
        // @ts-ignore
        pointerEvents: "all !important",
        cursor: "not-allowed"
      }
    },
    ":hover": {
      bg: "$backgroundLight50"
    },
    ":active": {
      bg: "$backgroundLight100"
    },
    ":focus": {
      bg: "$backgroundLight100"
    },
    "_dark": {
      ":hover": {
        bg: "$backgroundDark800"
      },
      ":active": {
        bg: "$backgroundDark700"
      },
      ":focus": {
        bg: "$backgroundDark700"
      }
    },
    "_web": {
      ":focusVisible": {
        bg: "$backgroundLight100",
        _dark: {
          bg: "$backgroundDark700"
        }
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ActionsheetItemText.ts
  var import_react17 = __require("./mock-20434.js");
  var ActionsheetItemText = (0, import_react17.createStyle)({
    mx: "$2",
    props: {
      size: "md"
    },
    color: "$textLight800",
    _dark: {
      color: "$textDark100"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ActionsheetScrollView.ts
  var import_react18 = __require("./mock-20434.js");
  var ActionsheetScrollView = (0, import_react18.createStyle)({
    w: "$full",
    h: "auto"
  });

  // node_modules/@gluestack-ui/config/src/theme/ActionsheetSectionHeaderText.ts
  var import_react19 = __require("./mock-20434.js");
  var ActionsheetSectionHeaderText = (0, import_react19.createStyle)({
    color: "$textLight500",
    props: { size: "xs" },
    textTransform: "uppercase",
    p: "$3",
    _dark: {
      color: "$textDark400"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ActionsheetSectionList.ts
  var import_react20 = __require("./mock-20434.js");
  var ActionsheetSectionList = (0, import_react20.createStyle)({
    w: "$full",
    h: "auto"
  });

  // node_modules/@gluestack-ui/config/src/theme/ActionsheetVirtualizedList.ts
  var import_react21 = __require("./mock-20434.js");
  var ActionsheetVirtualizedList = (0, import_react21.createStyle)({
    w: "$full",
    h: "auto"
  });

  // node_modules/@gluestack-ui/config/src/theme/Alert.ts
  var import_react22 = __require("./mock-20434.js");
  var Alert = (0, import_react22.createStyle)({
    alignItems: "center",
    p: "$3",
    flexDirection: "row",
    borderRadius: "$sm",
    variants: {
      action: {
        error: {
          bg: "$backgroundLightError",
          borderColor: "$error300",
          _icon: {
            color: "$error500"
          },
          _dark: {
            bg: "$backgroundDarkError",
            borderColor: "$error700",
            _icon: {
              color: "$error500"
            }
          }
        },
        warning: {
          bg: "$backgroundLightWarning",
          borderColor: "$warning300",
          _icon: {
            color: "$warning500"
          },
          _dark: {
            bg: "$backgroundDarkWarning",
            borderColor: "$warning700",
            _icon: {
              color: "$warning500"
            }
          }
        },
        success: {
          bg: "$backgroundLightSuccess",
          borderColor: "$success300",
          _icon: {
            color: "$success500"
          },
          _dark: {
            bg: "$backgroundDarkSuccess",
            borderColor: "$success700",
            _icon: {
              color: "$success500"
            }
          }
        },
        info: {
          bg: "$backgroundLightInfo",
          borderColor: "$info300",
          _icon: {
            color: "$info500"
          },
          _dark: {
            bg: "$backgroundDarkInfo",
            borderColor: "$info700",
            _icon: {
              color: "$info500"
            }
          }
        },
        muted: {
          bg: "$backgroundLightMuted",
          borderColor: "$secondary300",
          _icon: {
            color: "$secondary500"
          },
          _dark: {
            bg: "$backgroundDarkMuted",
            borderColor: "$secondary700",
            _icon: {
              color: "$secondary500"
            }
          }
        }
      },
      variant: {
        solid: {},
        outline: {
          borderWidth: "$1",
          bg: "$white",
          _dark: {
            bg: "$black"
          }
        },
        accent: {
          borderLeftWidth: "$4"
        }
      }
    },
    defaultProps: {
      variant: "solid",
      action: "info"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/AlertDialog.ts
  var import_react23 = __require("./mock-20434.js");
  var AlertDialog = (0, import_react23.createStyle)({
    w: "$full",
    h: "$full",
    justifyContent: "center",
    alignItems: "center",
    variants: {
      size: {
        xs: { _content: { w: "60%", maxWidth: 360 } },
        sm: { _content: { w: "70%", maxWidth: 420 } },
        md: { _content: { w: "80%", maxWidth: 510 } },
        lg: { _content: { w: "90%", maxWidth: 640 } },
        full: { _content: { w: "$full" } }
      }
    },
    defaultProps: { size: "md" },
    _web: {
      pointerEvents: "box-none"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/AlertDialogBackdrop.ts
  var import_react24 = __require("./mock-20434.js");
  var AlertDialogBackdrop = (0, import_react24.createStyle)({
    ":initial": {
      opacity: 0
    },
    ":animate": {
      opacity: 0.5
    },
    ":exit": {
      opacity: 0
    },
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 250,
      opacity: {
        type: "timing",
        duration: 250
      }
    },
    "position": "absolute",
    "left": 0,
    "top": 0,
    "right": 0,
    "bottom": 0,
    "bg": "$backgroundLight950",
    // @ts-ignore
    "_dark": {
      bg: "$backgroundDark950"
    },
    // @ts-ignore
    "_web": {
      cursor: "default"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/AlertDialogBody.ts
  var import_react25 = __require("./mock-20434.js");
  var AlertDialogBody = (0, import_react25.createStyle)({
    px: "$4",
    py: "$2"
  });

  // node_modules/@gluestack-ui/config/src/theme/AlertDialogCloseButton.ts
  var import_react26 = __require("./mock-20434.js");
  var AlertDialogCloseButton = (0, import_react26.createStyle)({
    "zIndex": 1,
    "rounded": "$sm",
    "p": "$2",
    "_icon": {
      color: "$backgroundLight400"
    },
    "_text": {
      color: "$backgroundLight400"
    },
    ":hover": {
      _icon: {
        color: "$backgroundLight700"
      },
      _text: {
        color: "$backgroundLight700"
      }
    },
    ":active": {
      _icon: {
        color: "$backgroundLight900"
      },
      _text: {
        color: "$backgroundLight900"
      }
    },
    "_dark": {
      "_icon": {
        color: "$backgroundLight400"
      },
      "_text": {
        color: "$backgroundLight400"
      },
      ":hover": {
        _icon: {
          color: "$backgroundDark200"
        },
        _text: {
          color: "$backgroundLight200"
        }
      },
      ":active": {
        _icon: {
          color: "$backgroundDark100"
        }
      }
    },
    ":focusVisible": {
      bg: "$backgroundLight100",
      _icon: {
        color: "$backgroundLight900"
      },
      _text: {
        color: "$backgroundLight900"
      },
      _dark: {
        bg: "$backgroundDark700",
        _icon: {
          color: "$backgroundLight100"
        },
        _text: {
          color: "$backgroundLight100"
        }
      }
    },
    "_web": {
      outlineWidth: 0,
      cursor: "pointer"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/AlertDialogContent.ts
  var import_react27 = __require("./mock-20434.js");
  var AlertDialogContent = (0, import_react27.createStyle)({
    "bg": "$backgroundLight50",
    "rounded": "$lg",
    "overflow": "hidden",
    //@ts-ignore
    ":initial": {
      scale: 0.9,
      opacity: 0
    },
    ":animate": {
      scale: 1,
      opacity: 1
    },
    ":exit": {
      scale: 0.9,
      opacity: 0
    },
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 250,
      opacity: {
        type: "timing",
        duration: 250
      }
    },
    // @ts-ignore
    "_dark": {
      bg: "$backgroundDark900"
    },
    "defaultProps": {
      softShadow: "3"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/AlertDialogFooter.ts
  var import_react28 = __require("./mock-20434.js");
  var AlertDialogFooter = (0, import_react28.createStyle)({
    p: "$4",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
    borderColor: "$borderLight300",
    _dark: {
      borderColor: "$borderDark700"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/AlertDialogHeader.ts
  var import_react29 = __require("./mock-20434.js");
  var AlertDialogHeader = (0, import_react29.createStyle)({
    p: "$4",
    borderColor: "$borderLight300",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    _dark: {
      borderColor: "$borderDark700"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/AlertIcon.ts
  var import_react30 = __require("./mock-20434.js");
  var AlertIcon = (0, import_react30.createStyle)({
    props: {
      size: "md"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/AlertText.ts
  var import_react31 = __require("./mock-20434.js");
  var AlertText = (0, import_react31.createStyle)({
    flex: 1
  });

  // node_modules/@gluestack-ui/config/src/theme/Avatar.ts
  var import_react32 = __require("./mock-20434.js");
  var Avatar = (0, import_react32.createStyle)({
    borderRadius: "$full",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    bg: "$primary600",
    variants: {
      size: {
        "xs": {
          w: "$6",
          h: "$6",
          _badge: {
            w: "$2",
            h: "$2"
          },
          _image: {
            w: "$full",
            h: "$full"
          },
          _text: {
            props: { size: "2xs" }
          }
        },
        "sm": {
          w: "$8",
          h: "$8",
          _badge: {
            w: "$2",
            h: "$2"
          },
          _image: {
            w: "$full",
            h: "$full"
          },
          _text: {
            props: { size: "xs" }
          }
        },
        "md": {
          w: "$12",
          h: "$12",
          _badge: {
            w: "$3",
            h: "$3"
          },
          _image: {
            w: "$full",
            h: "$full"
          },
          _text: {
            props: { size: "md" }
          }
        },
        "lg": {
          w: "$16",
          h: "$16",
          _badge: {
            w: "$4",
            h: "$4"
          },
          _image: {
            w: "$full",
            h: "$full"
          },
          _text: {
            props: { size: "xl" }
          }
        },
        "xl": {
          w: "$24",
          h: "$24",
          _badge: {
            w: "$6",
            h: "$6"
          },
          _image: {
            w: "$full",
            h: "$full"
          },
          _text: {
            props: { size: "3xl" }
          }
        },
        "2xl": {
          w: "$32",
          h: "$32",
          _badge: {
            w: "$8",
            h: "$8"
          },
          _image: {
            w: "$full",
            h: "$full"
          },
          _text: {
            props: { size: "5xl" }
          }
        }
      }
    },
    defaultProps: {
      size: "md"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/AvatarBadge.ts
  var import_react33 = __require("./mock-20434.js");
  var AvatarBadge = (0, import_react33.createStyle)({
    w: "$5",
    h: "$5",
    bg: "$success500",
    borderRadius: "$full",
    position: "absolute",
    right: 0,
    bottom: 0,
    borderColor: "white",
    borderWidth: 2
  });

  // node_modules/@gluestack-ui/config/src/theme/AvatarFallbackText.ts
  var import_react34 = __require("./mock-20434.js");
  var AvatarFallbackText = (0, import_react34.createStyle)({
    color: "$textLight0",
    fontWeight: "$semibold",
    props: {
      size: "xl"
    },
    overflow: "hidden",
    textTransform: "uppercase",
    _web: {
      cursor: "default"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/AvatarGroup.ts
  var import_react35 = __require("./mock-20434.js");
  var AvatarGroup = (0, import_react35.createStyle)({
    flexDirection: "row-reverse",
    position: "relative",
    _avatar: {
      ml: -10
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/AvatarImage.ts
  var import_react36 = __require("./mock-20434.js");
  var AvatarImage = (0, import_react36.createStyle)({
    w: "$full",
    h: "$full",
    borderRadius: "$full",
    position: "absolute"
  });

  // node_modules/@gluestack-ui/config/src/theme/Badge.ts
  var import_react37 = __require("./mock-20434.js");
  var Badge = (0, import_react37.createStyle)({
    "flexDirection": "row",
    "alignItems": "center",
    "borderRadius": "$xs",
    "variants": {
      action: {
        error: {
          bg: "$backgroundLightError",
          borderColor: "$error300",
          _icon: {
            color: "$error600"
          },
          _text: {
            color: "$error600"
          },
          _dark: {
            bg: "$backgroundDarkError",
            borderColor: "$error700",
            _text: {
              color: "$error400"
            },
            _icon: {
              color: "$error400"
            }
          }
        },
        warning: {
          bg: "$backgroundLightWarning",
          borderColor: "$warning300",
          _icon: {
            color: "$warning600"
          },
          _text: {
            color: "$warning600"
          },
          _dark: {
            bg: "$backgroundDarkWarning",
            borderColor: "$warning700",
            _text: {
              color: "$warning400"
            },
            _icon: {
              color: "$warning400"
            }
          }
        },
        success: {
          bg: "$backgroundLightSuccess",
          borderColor: "$success300",
          _icon: {
            color: "$success600"
          },
          _text: {
            color: "$success600"
          },
          _dark: {
            bg: "$backgroundDarkSuccess",
            borderColor: "$success700",
            _text: {
              color: "$success400"
            },
            _icon: {
              color: "$success400"
            }
          }
        },
        info: {
          bg: "$backgroundLightInfo",
          borderColor: "$info300",
          _icon: {
            color: "$info600"
          },
          _text: {
            color: "$info600"
          },
          _dark: {
            bg: "$backgroundDarkInfo",
            borderColor: "$info700",
            _text: {
              color: "$info400"
            },
            _icon: {
              color: "$info400"
            }
          }
        },
        muted: {
          bg: "$backgroundLightMuted",
          borderColor: "$secondary300",
          _icon: {
            color: "$secondary600"
          },
          _text: {
            color: "$secondary600"
          },
          _dark: {
            bg: "$backgroundDarkMuted",
            borderColor: "$secondary700",
            _text: {
              color: "$secondary400"
            },
            _icon: {
              color: "$secondary400"
            }
          }
        }
      },
      variant: {
        solid: {},
        outline: {
          borderWidth: "$1"
        }
      },
      size: {
        sm: {
          px: "$2",
          _icon: {
            props: {
              size: "2xs"
            }
          },
          _text: {
            props: {
              size: "2xs"
            }
          }
        },
        md: {
          px: "$2",
          _icon: {
            props: {
              size: "xs"
            }
          },
          _text: {
            props: {
              size: "xs"
            }
          }
        },
        lg: {
          px: "$2",
          _icon: {
            props: { size: "sm" }
          },
          _text: {
            props: { size: "sm" }
          }
        }
      }
    },
    ":disabled": {
      opacity: 0.5
    },
    "defaultProps": {
      action: "info",
      variant: "solid",
      size: "md"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/BadgeIcon.ts
  var import_react38 = __require("./mock-20434.js");
  var BadgeIcon = (0, import_react38.createStyle)({
    props: {
      size: "md"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/BadgeText.ts
  var import_react39 = __require("./mock-20434.js");
  var BadgeText = (0, import_react39.createStyle)({
    textTransform: "uppercase"
  });

  // node_modules/@gluestack-ui/config/src/theme/Box.ts
  var import_react40 = __require("./mock-20434.js");
  var Box = (0, import_react40.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/Button.ts
  var import_react41 = __require("./mock-20434.js");
  var Button = (0, import_react41.createStyle)({
    "borderRadius": "$sm",
    "backgroundColor": "$primary500",
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "center",
    "_text": {
      color: "$textLight0",
      fontWeight: "$semibold",
      _dark: {
        color: "$textDark0"
      }
    },
    "_icon": {
      color: "$textLight0",
      _dark: {
        color: "$textDark0"
      }
    },
    "_spinner": {
      props: {
        color: "$backgroundLight0"
      },
      _dark: {
        props: {
          color: "$backgroundDark0"
        }
      }
    },
    "variants": {
      action: {
        primary: {
          "bg": "$primary500",
          "borderColor": "$primary300",
          ":hover": {
            bg: "$primary600",
            borderColor: "$primary400"
          },
          ":active": {
            bg: "$primary700",
            borderColor: "$primary700"
          },
          "_text": {
            "color": "$primary600",
            ":hover": {
              color: "$primary600"
            },
            ":active": {
              color: "$primary700"
            }
          },
          "_icon": {
            "color": "$primary600",
            ":hover": {
              color: "$primary600"
            },
            ":active": {
              color: "$primary700"
            }
          },
          "_spinner": {
            "props": {
              color: "$primary600"
            },
            ":hover": {
              props: {
                color: "$primary600"
              }
            },
            ":active": {
              props: {
                color: "$primary700"
              }
            }
          },
          "_dark": {
            "bg": "$primary400",
            "borderColor": "$primary700",
            ":hover": {
              bg: "$primary500",
              borderColor: "$primary400"
            },
            ":active": {
              bg: "$primary600",
              borderColor: "$primary300"
            },
            "_text": {
              "color": "$primary300",
              ":hover": {
                color: "$primary300"
              },
              ":active": {
                color: "$primary200"
              }
            },
            "_icon": {
              "color": "$primary300",
              ":hover": {
                color: "$primary300"
              },
              ":active": {
                color: "$primary200"
              }
            },
            "_spinner": {
              "props": { color: "$primary300" },
              ":hover": {
                props: { color: "$primary300" }
              },
              ":active": {
                props: { color: "$primary200" }
              }
            },
            ":focusVisible": {
              _web: {
                boxShadow: "offset 0 0 0 2px $info400"
              }
            }
          }
        },
        secondary: {
          "bg": "$secondary500",
          "borderColor": "$secondary300",
          ":hover": {
            bg: "$secondary600",
            borderColor: "$secondary400"
          },
          ":active": {
            bg: "$secondary700",
            borderColor: "$secondary700"
          },
          "_text": {
            "color": "$secondary600",
            ":hover": {
              color: "$secondary600"
            },
            ":active": {
              color: "$secondary700"
            }
          },
          "_icon": {
            "color": "$secondary600",
            ":hover": {
              color: "$secondary600"
            },
            ":active": {
              color: "$secondary700"
            }
          },
          "_spinner": {
            "props": {
              color: "$secondary600"
            },
            ":hover": {
              props: { color: "$secondary600" }
            },
            ":active": {
              props: { color: "$secondary700" }
            }
          },
          "_dark": {
            "bg": "$secondary400",
            "borderColor": "$secondary700",
            ":hover": {
              bg: "$secondary500",
              borderColor: "$secondary400"
            },
            ":active": {
              bg: "$secondary600",
              borderColor: "$secondary300"
            },
            "_text": {
              "color": "$secondary300",
              ":hover": {
                color: "$secondary300"
              },
              ":active": {
                color: "$secondary200"
              }
            },
            "_icon": {
              "color": "$secondary300",
              ":hover": {
                color: "$secondary300"
              },
              ":active": {
                color: "$secondary200"
              }
            },
            "_spinner": {
              "props": {
                color: "$secondary300"
              },
              ":hover": {
                props: { color: "$secondary300" }
              },
              ":active": {
                props: { color: "$secondary200" }
              }
            }
          }
        },
        positive: {
          "bg": "$success500",
          "borderColor": "$success300",
          ":hover": {
            bg: "$success600",
            borderColor: "$success400"
          },
          ":active": {
            bg: "$success700",
            borderColor: "$success700"
          },
          "_text": {
            "color": "$success600",
            ":hover": {
              color: "$success600"
            },
            ":active": {
              color: "$success700"
            }
          },
          "_icon": {
            "color": "$success600",
            ":hover": {
              color: "$success600"
            },
            ":active": {
              color: "$success700"
            }
          },
          "_spinner": {
            "props": {
              color: "$success600"
            },
            ":hover": {
              props: { color: "$success600" }
            },
            ":active": {
              props: { color: "$success700" }
            }
          },
          "_dark": {
            "bg": "$success400",
            "borderColor": "$success700",
            ":hover": {
              bg: "$success500",
              borderColor: "$success400"
            },
            ":active": {
              bg: "$success600",
              borderColor: "$success300"
            },
            "_text": {
              "color": "$success300",
              ":hover": {
                color: "$success300"
              },
              ":active": {
                color: "$success200"
              }
            },
            "_icon": {
              "color": "$success300",
              ":hover": {
                color: "$success300"
              },
              ":active": {
                color: "$success200"
              }
            },
            "_spinner": {
              "props": {
                color: "$success300"
              },
              ":hover": {
                props: { color: "$success300" }
              },
              ":active": {
                props: { color: "$success200" }
              }
            },
            ":focusVisible": {
              _web: {
                boxShadow: "offset 0 0 0 2px $info400"
              }
            }
          }
        },
        negative: {
          "bg": "$error500",
          "borderColor": "$error300",
          ":hover": {
            bg: "$error600",
            borderColor: "$error400"
          },
          ":active": {
            bg: "$error700",
            borderColor: "$error700"
          },
          "_text": {
            "color": "$error600",
            ":hover": {
              color: "$error600"
            },
            ":active": {
              color: "$error700"
            }
          },
          "_icon": {
            "color": "$error600",
            ":hover": {
              color: "$error600"
            },
            ":active": {
              color: "$error700"
            }
          },
          "_spinner": {
            "props": {
              color: "$error600"
            },
            ":hover": {
              props: { color: "$error600" }
            },
            ":active": {
              props: { color: "$error700" }
            }
          },
          "_dark": {
            "bg": "$error400",
            "borderColor": "$error700",
            ":hover": {
              bg: "$error500",
              borderColor: "$error400"
            },
            ":active": {
              bg: "$error600",
              borderColor: "$error300"
            },
            "_text": {
              "color": "$error300",
              ":hover": {
                color: "$error300"
              },
              ":active": {
                color: "$error200"
              }
            },
            "_icon": {
              "color": "$error300",
              ":hover": {
                color: "$error300"
              },
              ":active": {
                color: "$error200"
              }
            },
            "_spinner": {
              "props": {
                color: "$error300"
              },
              ":hover": {
                props: { color: "$error300" }
              },
              ":active": {
                props: { color: "$error200" }
              }
            },
            ":focusVisible": {
              _web: {
                boxShadow: "offset 0 0 0 2px $info400"
              }
            }
          }
        },
        default: {
          "bg": "$transparent",
          ":hover": {
            bg: "$backgroundLight50"
          },
          ":active": {
            bg: "transparent"
          },
          "_dark": {
            "bg": "transparent",
            ":hover": {
              bg: "$backgroundDark900"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      variant: {
        link: {
          "px": "$0",
          ":hover": {
            _text: {
              textDecorationLine: "underline"
            }
          },
          ":active": {
            _text: {
              textDecorationLine: "underline"
            }
          }
        },
        outline: {
          "bg": "transparent",
          "borderWidth": "$1",
          ":hover": {
            bg: "$backgroundLight50"
          },
          ":active": {
            bg: "transparent"
          },
          "_dark": {
            "bg": "transparent",
            ":hover": {
              bg: "$backgroundDark900"
            },
            ":active": {
              bg: "transparent"
            }
          }
        },
        solid: {
          _text: {
            "color": "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            }
          },
          _spinner: {
            "props": { color: "$textLight0" },
            ":hover": {
              props: { color: "$textLight0" }
            },
            ":active": {
              props: { color: "$textLight0" }
            }
          },
          _icon: {
            "props": { color: "$textLight0" },
            ":hover": {
              props: { color: "$textLight0" }
            },
            ":active": {
              props: { color: "$textLight0" }
            }
          },
          _dark: {
            _text: {
              "color": "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _spinner: {
              "props": { color: "$textDark0" },
              ":hover": {
                props: { color: "$textDark0" }
              },
              ":active": {
                props: { color: "$textDark0" }
              }
            },
            _icon: {
              "props": { color: "$textDark0" },
              ":hover": {
                props: { color: "$textDark0" }
              },
              ":active": {
                props: { color: "$textDark0" }
              }
            }
          }
        }
      },
      size: {
        xs: {
          px: "$3.5",
          h: "$8",
          _icon: {
            props: {
              size: "2xs"
            }
          },
          _text: {
            props: {
              size: "xs"
            }
          }
        },
        sm: {
          px: "$4",
          h: "$9",
          _icon: {
            props: {
              size: "sm"
            }
          },
          _text: {
            props: {
              size: "sm"
            }
          }
        },
        md: {
          px: "$5",
          h: "$10",
          _icon: {
            props: {
              size: "md"
            }
          },
          _text: {
            props: {
              size: "md"
            }
          }
        },
        lg: {
          px: "$6",
          h: "$11",
          _icon: {
            props: {
              size: "md"
            }
          },
          _text: {
            props: {
              size: "lg"
            }
          }
        },
        xl: {
          px: "$7",
          h: "$12",
          _icon: {
            props: {
              size: "lg"
            }
          },
          _text: {
            props: {
              size: "xl"
            }
          }
        }
      }
    },
    "compoundVariants": [
      {
        action: "primary",
        variant: "link",
        value: {
          "px": "$0",
          "bg": "transparent",
          ":hover": {
            bg: "transparent"
          },
          ":active": {
            bg: "transparent"
          },
          "_dark": {
            "bg": "transparent",
            ":hover": {
              bg: "transparent"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      {
        action: "secondary",
        variant: "link",
        value: {
          "px": "$0",
          "bg": "transparent",
          ":hover": {
            bg: "transparent"
          },
          ":active": {
            bg: "transparent"
          },
          "_dark": {
            "bg": "transparent",
            ":hover": {
              bg: "transparent"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      {
        action: "positive",
        variant: "link",
        value: {
          "px": "$0",
          "bg": "transparent",
          ":hover": {
            bg: "transparent"
          },
          ":active": {
            bg: "transparent"
          },
          "_dark": {
            "bg": "transparent",
            ":hover": {
              bg: "transparent"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      {
        action: "negative",
        variant: "link",
        value: {
          "px": "$0",
          "bg": "transparent",
          ":hover": {
            bg: "transparent"
          },
          ":active": {
            bg: "transparent"
          },
          "_dark": {
            "bg": "transparent",
            ":hover": {
              bg: "transparent"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      {
        action: "primary",
        variant: "outline",
        value: {
          "bg": "transparent",
          ":hover": {
            bg: "$backgroundLight50"
          },
          ":active": {
            bg: "transparent"
          },
          "_dark": {
            "bg": "transparent",
            ":hover": {
              bg: "$backgroundDark900"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      {
        action: "secondary",
        variant: "outline",
        value: {
          "bg": "transparent",
          ":hover": {
            bg: "$backgroundLight50"
          },
          ":active": {
            bg: "transparent"
          },
          "_dark": {
            "bg": "transparent",
            ":hover": {
              bg: "$backgroundDark900"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      {
        action: "positive",
        variant: "outline",
        value: {
          "bg": "transparent",
          ":hover": {
            bg: "$backgroundLight50"
          },
          ":active": {
            bg: "transparent"
          },
          "_dark": {
            "bg": "transparent",
            ":hover": {
              bg: "$backgroundDark900"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      {
        action: "negative",
        variant: "outline",
        value: {
          "bg": "transparent",
          ":hover": {
            bg: "$backgroundLight50"
          },
          ":active": {
            bg: "transparent"
          },
          "_dark": {
            "bg": "transparent",
            ":hover": {
              bg: "$backgroundDark900"
            },
            ":active": {
              bg: "transparent"
            }
          }
        }
      },
      {
        action: "primary",
        variant: "solid",
        value: {
          _text: {
            "color": "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            }
          },
          _icon: {
            "color": "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            }
          },
          _spinner: {
            "props": { color: "$textLight0" },
            ":hover": {
              props: { color: "$textLight0" }
            },
            ":active": {
              props: { color: "$textLight0" }
            }
          },
          _dark: {
            _text: {
              "color": "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _icon: {
              "color": "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _spinner: {
              "props": { color: "$textDark0" },
              ":hover": {
                props: { color: "$textDark0" }
              },
              ":active": {
                props: { color: "$textDark0" }
              }
            }
          }
        }
      },
      {
        action: "secondary",
        variant: "solid",
        value: {
          _text: {
            "color": "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            }
          },
          _icon: {
            "color": "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            }
          },
          _spinner: {
            "props": { color: "$textLight0" },
            ":hover": {
              props: { color: "$textLight0" }
            },
            ":active": {
              props: { color: "$textLight0" }
            }
          },
          _dark: {
            _text: {
              "color": "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _icon: {
              "color": "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _spinner: {
              "props": { color: "$textDark0" },
              ":hover": {
                props: { color: "$textDark0" }
              },
              ":active": {
                props: { color: "$textDark0" }
              }
            }
          }
        }
      },
      {
        action: "positive",
        variant: "solid",
        value: {
          _text: {
            "color": "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            }
          },
          _icon: {
            "color": "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            },
            "props": { color: "$textLight0" }
          },
          _spinner: {
            "props": { color: "$textLight0" },
            ":hover": {
              props: { color: "$textLight0" }
            },
            ":active": {
              props: { color: "$textLight0" }
            }
          },
          _dark: {
            _text: {
              "color": "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _icon: {
              "color": "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _spinner: {
              "props": { color: "$textDark0" },
              ":hover": {
                props: { color: "$textDark0" }
              },
              ":active": {
                props: { color: "$textDark0" }
              }
            }
          }
        }
      },
      {
        action: "negative",
        variant: "solid",
        value: {
          _text: {
            "color": "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            }
          },
          _icon: {
            "color": "$textLight0",
            ":hover": {
              color: "$textLight0"
            },
            ":active": {
              color: "$textLight0"
            }
          },
          _spinner: {
            "props": { color: "$textLight0" },
            ":hover": {
              props: { color: "$textLight0" }
            },
            ":active": {
              props: { color: "$textLight0" }
            }
          },
          _dark: {
            _text: {
              "color": "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _icon: {
              "color": "$textDark0",
              ":hover": {
                color: "$textDark0"
              },
              ":active": {
                color: "$textDark0"
              }
            },
            _spinner: {
              "props": { color: "$textDark0" },
              ":hover": {
                props: { color: "$textDark0" }
              },
              ":active": {
                props: { color: "$textDark0" }
              }
            }
          }
        }
      }
    ],
    "props": {
      size: "md",
      variant: "solid",
      action: "primary"
    },
    "_web": {
      ":focusVisible": {
        outlineWidth: "$0.5",
        outlineColor: "$primary700",
        outlineStyle: "solid",
        _dark: {
          outlineColor: "$primary300"
        }
      }
    },
    ":disabled": {
      opacity: 0.4
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ButtonGroup.ts
  var import_react42 = __require("./mock-20434.js");
  var ButtonGroup = (0, import_react42.createStyle)({
    variants: {
      size: {
        xs: {
          _button: {
            props: {
              size: "xs"
            }
          }
        },
        sm: {
          _button: {
            props: {
              size: "sm"
            }
          }
        },
        md: {
          _button: {
            props: {
              size: "md"
            }
          }
        },
        lg: {
          _button: {
            props: {
              size: "lg"
            }
          }
        },
        xl: {
          _button: {
            _button: {
              props: {
                size: "xl"
              }
            }
          }
        }
      },
      space: {
        "xs": {
          gap: "$1"
        },
        "sm": {
          gap: "$2"
        },
        "md": {
          gap: "$3"
        },
        "lg": {
          gap: "$4"
        },
        "xl": {
          gap: "$5"
        },
        "2xl": {
          gap: "$6"
        },
        "3xl": {
          gap: "$7"
        },
        "4xl": {
          gap: "$8"
        }
      },
      isAttached: {
        true: {
          gap: 0
        }
      }
    },
    defaultProps: {
      size: "md",
      space: "sm"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ButtonGroupHSpacer.ts
  var import_react43 = __require("./mock-20434.js");
  var ButtonGroupHSpacer = (0, import_react43.createStyle)({
    variants: {
      space: {
        xs: {
          w: "$1"
        },
        sm: {
          w: "$1.5"
        },
        md: {
          w: "$2"
        },
        lg: {
          w: "$3"
        },
        xl: {
          w: "$4"
        }
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ButtonGroupVSpacer.ts
  var import_react44 = __require("./mock-20434.js");
  var ButtonGroupVSpacer = (0, import_react44.createStyle)({
    variants: {
      space: {
        xs: {
          h: "$1"
        },
        sm: {
          h: "$1.5"
        },
        md: {
          h: "$2"
        },
        lg: {
          h: "$3"
        },
        xl: {
          h: "$4"
        }
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ButtonIcon.ts
  var import_react45 = __require("./mock-20434.js");
  var ButtonIcon = (0, import_react45.createStyle)({
    props: {
      size: "md"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ButtonSpinner.ts
  var import_react46 = __require("./mock-20434.js");
  var ButtonSpinner = (0, import_react46.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/ButtonText.ts
  var import_react47 = __require("./mock-20434.js");
  var ButtonText = (0, import_react47.createStyle)({
    color: "$textLight0",
    _web: {
      userSelect: "none"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Card.ts
  var import_react48 = __require("./mock-20434.js");
  var Card = (0, import_react48.createStyle)({
    variants: {
      size: {
        sm: {
          p: "$3",
          borderRadius: "$sm"
        },
        md: {
          p: "$4",
          borderRadius: "$md"
        },
        lg: {
          p: "$6",
          borderRadius: "$xl"
        }
      },
      variant: {
        elevated: {
          bg: "$backgroundLight0",
          shadowColor: "$backgroundLight800",
          shadowOffset: {
            width: 0,
            height: 1
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
          _dark: {
            bg: "$backgroundDark900"
          }
        },
        outline: {
          borderWidth: 1,
          borderColor: "$borderLight200",
          _dark: {
            borderColor: "$borderDark800"
          }
        },
        ghost: {
          borderRadius: "none"
        },
        filled: {
          bg: "$backgroundLight50",
          _dark: {
            bg: "$backgroundDark900"
          }
        }
      }
    },
    defaultProps: {
      theme: "light",
      size: "md",
      variant: "elevated"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Center.ts
  var import_react49 = __require("./mock-20434.js");
  var Center = (0, import_react49.createStyle)({
    alignItems: "center",
    justifyContent: "center"
  });

  // node_modules/@gluestack-ui/config/src/theme/Checkbox.ts
  var import_react50 = __require("./mock-20434.js");
  var Checkbox = (0, import_react50.createStyle)({
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    variants: {
      size: {
        lg: {
          _text: {
            props: {
              size: "lg"
            }
          },
          _icon: {
            props: {
              size: "md"
            }
          },
          _indicator: {
            borderWidth: 3,
            h: "$6",
            w: "$6"
          }
        },
        md: {
          _text: {
            props: {
              size: "md"
            }
          },
          _icon: {
            props: {
              size: "sm"
            }
          },
          _indicator: {
            borderWidth: 2,
            h: "$5",
            w: "$5"
          }
        },
        sm: {
          _text: {
            props: {
              size: "sm"
            }
          },
          _icon: {
            props: {
              size: "2xs"
            }
          },
          _indicator: {
            borderWidth: 2,
            h: "$4",
            w: "$4"
          }
        }
      }
    },
    defaultProps: {
      size: "md"
    },
    _web: {
      "cursor": "pointer",
      ":disabled": {
        cursor: "not-allowed"
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/CheckboxGroup.ts
  var import_react51 = __require("./mock-20434.js");
  var CheckboxGroup = (0, import_react51.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/CheckboxIcon.ts
  var import_react52 = __require("./mock-20434.js");
  var CheckboxIcon = (0, import_react52.createStyle)({
    ":checked": {
      color: "$backgroundLight0"
    },
    ":disabled": {
      opacity: 0.4
    },
    "_dark": {
      ":checked": {
        color: "$backgroundDark0"
      },
      ":disabled": {
        opacity: 0.4
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/CheckboxIndicator.ts
  var import_react53 = __require("./mock-20434.js");
  var CheckboxIndicator = (0, import_react53.createStyle)({
    "justifyContent": "center",
    "alignItems": "center",
    "borderColor": "$borderLight400",
    "bg": "$transparent",
    "borderRadius": 4,
    "_web": {
      ":focusVisible": {
        outlineWidth: "2px",
        outlineColor: "$primary700",
        outlineStyle: "solid",
        _dark: {
          outlineColor: "$primary300"
        }
      }
    },
    ":checked": {
      borderColor: "$primary600",
      bg: "$primary600"
    },
    ":hover": {
      "borderColor": "$borderLight500",
      "bg": "transparent",
      ":invalid": {
        borderColor: "$error700"
      },
      ":checked": {
        "bg": "$primary700",
        "borderColor": "$primary700",
        ":disabled": {
          "borderColor": "$primary600",
          "bg": "$primary600",
          "opacity": 0.4,
          ":invalid": {
            borderColor: "$error700"
          }
        }
      },
      ":disabled": {
        "borderColor": "$borderLight400",
        ":invalid": {
          borderColor: "$error700"
        }
      }
    },
    ":active": {
      ":checked": {
        bg: "$primary800",
        borderColor: "$primary800"
      }
    },
    ":invalid": {
      borderColor: "$error700"
    },
    ":disabled": {
      opacity: 0.4
    },
    "_dark": {
      "borderColor": "$borderDark500",
      "bg": "$transparent",
      ":checked": {
        borderColor: "$primary500",
        bg: "$primary500"
      },
      ":hover": {
        "borderColor": "$borderDark400",
        "bg": "transparent",
        ":invalid": {
          borderColor: "$error400"
        },
        ":checked": {
          "bg": "$primary400",
          "borderColor": "$primary400",
          ":disabled": {
            "borderColor": "$primary500",
            "bg": "$primary500",
            "opacity": 0.4,
            ":invalid": {
              borderColor: "$error400"
            }
          }
        },
        ":disabled": {
          "borderColor": "$borderDark500",
          ":invalid": {
            borderColor: "$error400"
          }
        }
      },
      ":active": {
        ":checked": {
          bg: "$primary300",
          borderColor: "$primary300"
        }
      },
      ":invalid": {
        borderColor: "$error400"
      },
      ":disabled": {
        opacity: 0.4
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/CheckboxLabel.ts
  var import_react54 = __require("./mock-20434.js");
  var CheckboxLabel = (0, import_react54.createStyle)({
    "color": "$textLight600",
    ":checked": {
      color: "$textLight900"
    },
    ":hover": {
      "color": "$textLight900",
      ":checked": {
        "color": "$textLight900",
        ":disabled": {
          color: "$textLight900"
        }
      },
      ":disabled": {
        color: "$textLight600"
      }
    },
    ":active": {
      "color": "$textLight900",
      ":checked": {
        color: "$textLight900"
      }
    },
    ":disabled": {
      opacity: 0.4
    },
    "_web": {
      MozUserSelect: "none",
      WebkitUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none"
    },
    "_dark": {
      "color": "$textDark400",
      ":checked": {
        color: "$textDark100"
      },
      ":hover": {
        "color": "$textDark100",
        ":checked": {
          "color": "$textDark100",
          ":disabled": {
            color: "$textDark100"
          }
        }
      },
      ":disabled": {
        color: "$textDark100"
      },
      ":active": {
        "color": "$textDark100",
        ":checked": {
          color: "$textDark100"
        }
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Divider.ts
  var import_react55 = __require("./mock-20434.js");
  var Divider = (0, import_react55.createStyle)({
    bg: "$backgroundLight200",
    _dark: {
      bg: "$backgroundLight800"
    },
    variants: {
      orientation: {
        vertical: {
          width: "$px",
          height: "$full"
        },
        horizontal: {
          height: "$px",
          width: "$full"
        }
      }
    },
    defaultProps: {
      orientation: "horizontal"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Fab.ts
  var import_react56 = __require("./mock-20434.js");
  var Fab = (0, import_react56.createStyle)({
    "bg": "$primary500",
    "rounded": "$full",
    "zIndex": 20,
    "p": 16,
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center",
    "position": "absolute",
    ":hover": {
      bg: "$primary600"
    },
    ":active": {
      bg: "$primary700"
    },
    ":disabled": {
      opacity: 0.4,
      _web: {
        // @ts-ignore
        pointerEvents: "all !important",
        cursor: "not-allowed"
      }
    },
    "_text": {
      color: "$textLight50",
      fontWeight: "$normal",
      _dark: {
        _text: {
          color: "$textDark50"
        }
      }
    },
    "_icon": {
      "color": "$textLight50",
      ":hover": {
        color: "$textLight0"
      },
      ":active": {
        color: "$textLight0"
      },
      "_dark": {
        _icon: {
          "color": "$textDark0",
          ":hover": {
            color: "$textDark0"
          },
          ":active": {
            color: "$textDark0"
          }
        }
      }
    },
    "_dark": {
      "bg": "$primary400",
      ":hover": {
        bg: "$primary500"
      },
      ":active": {
        bg: "$primary600"
      },
      ":disabled": {
        opacity: 0.4,
        _web: {
          cursor: "not-allowed"
        }
      }
    },
    "_web": {
      ":focusVisible": {
        outlineWidth: 2,
        outlineColor: "$primary700",
        outlineStyle: "solid",
        _dark: {
          outlineColor: "$primary300"
        }
      }
    },
    "variants": {
      size: {
        sm: {
          px: "$2.5",
          py: "$2.5",
          _text: {
            fontSize: "$sm"
          },
          _icon: {
            props: {
              size: "sm"
            }
          }
        },
        md: {
          px: "$3",
          py: "$3",
          _text: {
            fontSize: "$md"
          },
          _icon: {
            props: {
              size: "md"
            }
          }
        },
        lg: {
          px: "$4",
          py: "$4",
          _text: {
            fontSize: "$lg"
          },
          _icon: {
            props: {
              size: "md"
            }
          }
        }
      },
      placement: {
        "top right": {
          top: "$4",
          right: "$4"
        },
        "top left": {
          top: "$4",
          left: "$4"
        },
        "bottom right": {
          bottom: "$4",
          right: "$4"
        },
        "bottom left": {
          bottom: "$4",
          left: "$4"
        },
        "top center": {
          top: "$4",
          alignSelf: "center"
          // TODO: fix this, this is correct way, but React Native doesn't support this on Native
          // left: '50%',
          // transform: [
          //   {
          //     // @ts-ignore
          //     translateX: '-50%',
          //   },
          // ],
        },
        "bottom center": {
          bottom: "$4",
          alignSelf: "center"
          // TODO: fix this, this is correct way, but React Native doesn't support this on Native
          // left: '50%',
          // transform: [
          //   {
          //     // @ts-ignore
          //     translateX: '-50%',
          //   },
          // ],
        }
      }
    },
    "defaultProps": {
      placement: "bottom right",
      size: "md",
      hardShadow: "2"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/FabIcon.ts
  var import_react57 = __require("./mock-20434.js");
  var FabIcon = (0, import_react57.createStyle)({
    props: {
      size: "md"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/FabLabel.ts
  var import_react58 = __require("./mock-20434.js");
  var FabLabel = (0, import_react58.createStyle)({
    color: "$textLight50"
  });

  // node_modules/@gluestack-ui/config/src/theme/FlatList.ts
  var import_react59 = __require("./mock-20434.js");
  var FlatList = (0, import_react59.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/FormControl.ts
  var import_react60 = __require("./mock-20434.js");
  var FormControl = (0, import_react60.createStyle)({
    flexDirection: "column",
    variants: {
      size: {
        sm: {
          _labelText: {
            props: { size: "sm" }
          },
          _labelAstrick: {
            props: { size: "sm" }
          },
          _helperText: {
            props: { size: "xs" }
          },
          _errorText: {
            props: { size: "xs" }
          }
        },
        md: {
          _labelText: {
            props: { size: "md" }
          },
          _labelAstrick: {
            props: { size: "md" }
          },
          _helperText: {
            props: { size: "sm" }
          },
          _errorText: {
            props: { size: "sm" }
          }
        },
        lg: {
          _labelText: {
            props: { size: "lg" }
          },
          _labelAstrick: {
            props: { size: "lg" }
          },
          _helperText: {
            props: { size: "md" }
          },
          _errorText: {
            props: { size: "md" }
          }
        }
      }
    },
    defaultProps: {
      size: "md"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/FormControlError.ts
  var import_react61 = __require("./mock-20434.js");
  var FormControlError = (0, import_react61.createStyle)({
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    mt: "$1",
    gap: "$1"
  });

  // node_modules/@gluestack-ui/config/src/theme/FormControlErrorIcon.ts
  var import_react62 = __require("./mock-20434.js");
  var FormControlErrorIcon = (0, import_react62.createStyle)({
    color: "$error700",
    _dark: {
      //@ts-ignore
      color: "$error400"
    },
    props: {
      size: "sm"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/FormControlErrorText.ts
  var import_react63 = __require("./mock-20434.js");
  var FormControlErrorText = (0, import_react63.createStyle)({
    color: "$error700",
    _dark: {
      color: "$error400"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/FormControlHelper.ts
  var import_react64 = __require("./mock-20434.js");
  var FormControlHelper = (0, import_react64.createStyle)({
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    mt: "$1"
  });

  // node_modules/@gluestack-ui/config/src/theme/FormControlHelperText.ts
  var import_react65 = __require("./mock-20434.js");
  var FormControlHelperText = (0, import_react65.createStyle)({
    props: {
      size: "xs"
    },
    color: "$textLight500",
    _dark: {
      color: "$textDark400"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/FormControlLabel.ts
  var import_react66 = __require("./mock-20434.js");
  var FormControlLabel = (0, import_react66.createStyle)({
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    mb: "$1"
  });

  // node_modules/@gluestack-ui/config/src/theme/FormControlLabelText.ts
  var import_react67 = __require("./mock-20434.js");
  var FormControlLabelText = (0, import_react67.createStyle)({
    fontWeight: "$medium",
    color: "$textLight900",
    _dark: {
      color: "$textDark50"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/HStack.ts
  var import_react68 = __require("./mock-20434.js");
  var HStack = (0, import_react68.createStyle)({
    flexDirection: "row",
    variants: {
      space: {
        "xs": {
          gap: `$1`
        },
        "sm": {
          gap: `$2`
        },
        "md": {
          gap: `$3`
        },
        "lg": {
          gap: `$4`
        },
        "xl": {
          gap: `$5`
        },
        "2xl": {
          gap: `$6`
        },
        "3xl": {
          gap: `$7`
        },
        "4xl": {
          gap: `$8`
        }
      },
      reversed: {
        true: {
          flexDirection: "row-reverse"
        }
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Heading.ts
  var import_react69 = __require("./mock-20434.js");
  var import_html_elements = __require("./mock-20434.js");
  var Heading = (0, import_react69.createStyle)({
    color: "$textLight900",
    letterSpacing: "$sm",
    fontWeight: "$bold",
    fontFamily: "$heading",
    // Overrides expo-html default styling
    marginVertical: 0,
    _dark: {
      color: "$textDark50"
    },
    variants: {
      isTruncated: {
        true: {
          props: {
            // @ts-ignore
            numberOfLines: 1,
            ellipsizeMode: "tail"
          }
        }
      },
      bold: {
        true: {
          fontWeight: "$bold"
        }
      },
      underline: {
        true: {
          textDecorationLine: "underline"
        }
      },
      strikeThrough: {
        true: {
          textDecorationLine: "line-through"
        }
      },
      sub: {
        true: {
          fontSize: "$xs",
          lineHeight: "$xs"
        }
      },
      italic: {
        true: {
          fontStyle: "italic"
        }
      },
      highlight: {
        true: {
          bg: "$yellow500"
        }
      },
      size: {
        "5xl": {
          //@ts-ignore
          props: { as: import_html_elements.H1 },
          fontSize: "$6xl",
          lineHeight: "$7xl"
        },
        "4xl": {
          //@ts-ignore
          props: { as: import_html_elements.H1 },
          fontSize: "$5xl",
          lineHeight: "$6xl"
        },
        "3xl": {
          //@ts-ignore
          props: { as: import_html_elements.H1 },
          fontSize: "$4xl",
          lineHeight: "$5xl"
        },
        "2xl": {
          //@ts-ignore
          props: { as: import_html_elements.H2 },
          fontSize: "$3xl",
          lineHeight: "$3xl"
        },
        "xl": {
          //@ts-ignore
          props: { as: import_html_elements.H3 },
          fontSize: "$2xl",
          lineHeight: "$3xl"
        },
        "lg": {
          //@ts-ignore
          props: { as: import_html_elements.H4 },
          fontSize: "$xl",
          lineHeight: "$2xl"
        },
        "md": {
          //@ts-ignore
          props: { as: import_html_elements.H5 },
          fontSize: "$lg",
          lineHeight: "$lg"
        },
        "sm": {
          //@ts-ignore
          props: { as: import_html_elements.H6 },
          fontSize: "$md",
          lineHeight: "$lg"
        },
        "xs": {
          //@ts-ignore
          props: { as: import_html_elements.H6 },
          fontSize: "$sm",
          lineHeight: "$xs"
        }
      }
    },
    defaultProps: {
      size: "lg"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Icon.ts
  var import_react70 = __require("./mock-20434.js");
  var BaseIcon = (0, import_react70.createStyle)({
    color: "$backgroundLight800",
    _dark: {
      color: "$backgroundDark400"
    },
    variants: {
      size: {
        "2xs": {
          h: "$3",
          w: "$3",
          props: {
            // @ts-ignore
            size: 12
          }
        },
        "xs": {
          h: "$3.5",
          w: "$3.5",
          props: {
            //@ts-ignore
            size: 14
          }
        },
        "sm": {
          h: "$4",
          w: "$4",
          props: {
            //@ts-ignore
            size: 16
          }
        },
        "md": {
          h: "$4.5",
          w: "$4.5",
          props: {
            //@ts-ignore
            size: 18
          }
        },
        "lg": {
          h: "$5",
          w: "$5",
          props: {
            //@ts-ignore
            size: 20
          }
        },
        "xl": {
          h: "$6",
          w: "$6",
          props: {
            //@ts-ignore
            size: 24
          }
        }
      }
    }
    // defaultProps: {
    //   size: 'md',
    // },
  });
  var Icon = (0, import_react70.createStyle)({
    props: {
      size: "md",
      //@ts-ignore
      fill: "none"
    },
    color: "$backgroundLight800",
    _dark: {
      //@ts-ignore
      color: "$backgroundDark400"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Image.ts
  var import_react71 = __require("./mock-20434.js");
  var Image = (0, import_react71.createStyle)({
    maxWidth: "$full",
    _web: {
      props: {
        // set property to revert-layer as RNW always set image height width inline
        style: {
          height: "revert-layer",
          width: "revert-layer"
        }
      }
    },
    variants: {
      size: {
        "2xs": {
          w: "$6",
          h: "$6"
        },
        "xs": {
          w: "$10",
          h: "$10"
        },
        "sm": {
          w: "$16",
          h: "$16"
        },
        "md": {
          w: "$20",
          h: "$20"
        },
        "lg": {
          w: "$24",
          h: "$24"
        },
        "xl": {
          w: "$32",
          h: "$32"
        },
        "2xl": {
          w: "$64",
          h: "$64"
        },
        "full": {
          w: "$full",
          h: "$full"
        }
      }
    },
    defaultProps: {
      size: "md"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Input.ts
  var import_react72 = __require("./mock-20434.js");
  var Input = (0, import_react72.createStyle)({
    "borderWidth": 1,
    "borderColor": "$backgroundLight300",
    "borderRadius": "$sm",
    "flexDirection": "row",
    "overflow": "hidden",
    "alignContent": "center",
    ":hover": {
      borderColor: "$borderLight400"
    },
    ":focus": {
      "borderColor": "$primary700",
      ":hover": {
        borderColor: "$primary700"
      }
    },
    ":disabled": {
      "opacity": 0.4,
      ":hover": {
        borderColor: "$backgroundLight300"
      }
    },
    "_input": {
      py: "auto",
      px: "$3",
      overflow: "hidden"
    },
    "_icon": {
      color: "$textLight400"
    },
    "_dark": {
      "borderColor": "$borderDark700",
      ":hover": {
        borderColor: "$borderDark400"
      },
      ":focus": {
        "borderColor": "$primary400",
        ":hover": {
          borderColor: "$primary400"
        }
      },
      ":disabled": {
        ":hover": {
          borderColor: "$borderDark700"
        }
      }
    },
    "variants": {
      size: {
        xl: {
          h: "$12",
          _input: {
            props: {
              size: "xl"
            }
          },
          _icon: {
            props: {
              size: "xl"
            }
          }
        },
        lg: {
          h: "$11",
          _input: {
            props: {
              size: "lg"
            }
          },
          _icon: {
            props: {
              size: "lg"
            }
          }
        },
        md: {
          h: "$10",
          _input: {
            props: {
              size: "md"
            }
          },
          _icon: {
            props: {
              size: "sm"
            }
          }
        },
        sm: {
          h: "$9",
          _input: {
            props: {
              size: "sm"
            }
          },
          _icon: {
            props: {
              size: "xs"
            }
          }
        }
      },
      variant: {
        underlined: {
          "_input": {
            _web: {
              outlineWidth: 0,
              outline: "none"
            },
            px: "$0"
          },
          "borderWidth": 0,
          "borderRadius": 0,
          "borderBottomWidth": "$1",
          ":focus": {
            borderColor: "$primary700",
            _web: {
              boxShadow: "inset 0 -1px 0 0 $primary700"
            }
          },
          ":invalid": {
            "borderBottomWidth": 2,
            "borderBottomColor": "$error700",
            "_web": {
              boxShadow: "inset 0 -1px 0 0 $error700"
            },
            ":hover": {
              borderBottomColor: "$error700"
            },
            ":focus": {
              "borderBottomColor": "$error700",
              ":hover": {
                borderBottomColor: "$error700",
                _web: {
                  boxShadow: "inset 0 -1px 0 0 $error700"
                }
              }
            },
            ":disabled": {
              ":hover": {
                borderBottomColor: "$error700",
                _web: {
                  boxShadow: "inset 0 -1px 0 0 $error700"
                }
              }
            }
          },
          "_dark": {
            ":focus": {
              borderColor: "$primary400",
              _web: {
                boxShadow: "inset 0 -1px 0 0 $primary400"
              }
            },
            ":invalid": {
              "borderColor": "$error400",
              "_web": {
                boxShadow: "inset 0 -1px 0 0 $error400"
              },
              ":hover": {
                borderBottomColor: "$error400"
              },
              ":focus": {
                "borderBottomColor": "$error400",
                ":hover": {
                  borderBottomColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 -1px 0 0 $error400"
                  }
                }
              },
              ":disabled": {
                ":hover": {
                  borderBottomColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 -1px 0 0 $error400"
                  }
                }
              }
            }
          }
        },
        outline: {
          "_input": {
            _web: {
              outlineWidth: 0,
              outline: "none"
            }
          },
          ":focus": {
            borderColor: "$primary700",
            _web: {
              boxShadow: "inset 0 0 0 1px $primary700"
            }
          },
          ":invalid": {
            "borderColor": "$error700",
            "_web": {
              boxShadow: "inset 0 0 0 1px $error700"
            },
            ":hover": {
              borderColor: "$error700"
            },
            ":focus": {
              "borderColor": "$error700",
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            },
            ":disabled": {
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            }
          },
          "_dark": {
            ":focus": {
              borderColor: "$primary400",
              _web: {
                boxShadow: "inset 0 0 0 1px $primary400"
              }
            },
            ":invalid": {
              "borderColor": "$error400",
              "_web": {
                boxShadow: "inset 0 0 0 1px $error400"
              },
              ":hover": {
                borderColor: "$error400"
              },
              ":focus": {
                "borderColor": "$error400",
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              },
              ":disabled": {
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              }
            }
          }
        },
        rounded: {
          "borderRadius": 999,
          "_input": {
            px: "$4",
            _web: {
              outlineWidth: 0,
              outline: "none"
            }
          },
          ":focus": {
            borderColor: "$primary700",
            _web: {
              boxShadow: "inset 0 0 0 1px $primary700"
            }
          },
          ":invalid": {
            "borderColor": "$error700",
            "_web": {
              boxShadow: "inset 0 0 0 1px $error700"
            },
            ":hover": {
              borderColor: "$error700"
            },
            ":focus": {
              "borderColor": "$error700",
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            },
            ":disabled": {
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            }
          },
          "_dark": {
            ":focus": {
              borderColor: "$primary400",
              _web: {
                boxShadow: "inset 0 0 0 1px $primary400"
              }
            },
            ":invalid": {
              "borderColor": "$error400",
              "_web": {
                boxShadow: "inset 0 0 0 1px $error400"
              },
              ":hover": {
                borderColor: "$error400"
              },
              ":focus": {
                "borderColor": "$error400",
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              },
              ":disabled": {
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              }
            }
          }
        }
      }
    },
    "defaultProps": {
      size: "md",
      variant: "outline"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/InputField.ts
  var import_react73 = __require("./mock-20434.js");
  var InputField = (0, import_react73.createStyle)({
    flex: 1,
    color: "$textLight900",
    props: {
      placeholderTextColor: "$textLight500"
    },
    _dark: {
      color: "$textDark50",
      props: {
        placeholderTextColor: "$textDark400"
      }
    },
    _web: {
      "cursor": "text",
      ":disabled": {
        cursor: "not-allowed"
      }
    },
    variants: {
      size: {
        "2xs": {
          fontSize: "$2xs"
        },
        "xs": {
          fontSize: "$xs"
        },
        "sm": {
          fontSize: "$sm"
        },
        "md": {
          fontSize: "$md"
        },
        "lg": {
          fontSize: "$lg"
        },
        "xl": {
          fontSize: "$xl"
        },
        "2xl": {
          fontSize: "$2xl"
        },
        "3xl": {
          fontSize: "$3xl"
        },
        "4xl": {
          fontSize: "$4xl"
        },
        "5xl": {
          fontSize: "$5xl"
        },
        "6xl": {
          fontSize: "$6xl"
        }
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/InputIcon.ts
  var import_react74 = __require("./mock-20434.js");
  var InputIcon = (0, import_react74.createStyle)({
    props: {
      size: "md"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/InputSlot.ts
  var import_react75 = __require("./mock-20434.js");
  var InputSlot = (0, import_react75.createStyle)({
    justifyContent: "center",
    alignItems: "center",
    _web: {
      ":disabled": {
        cursor: "not-allowed"
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/KeyboardAvoidingView.ts
  var import_react76 = __require("./mock-20434.js");
  var KeyboardAvoidingView = (0, import_react76.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/Link.ts
  var import_react77 = __require("./mock-20434.js");
  var Link = (0, import_react77.createStyle)({
    _web: {
      "outlineWidth": 0,
      ":disabled": {
        cursor: "not-allowed"
      },
      ":focusVisible": {
        outlineWidth: 2,
        outlineColor: "$primary700",
        outlineStyle: "solid",
        _dark: {
          outlineColor: "$primary400"
        }
      }
    },
    _text: {
      ":hover": {
        color: "$info600",
        textDecorationLine: "none"
      },
      ":active": {
        color: "$info700"
      },
      ":disabled": {
        opacity: 0.4
      },
      "_dark": {
        ":hover": {
          color: "$info400"
        },
        ":active": {
          color: "$info300"
        }
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/LinkText.ts
  var import_react78 = __require("./mock-20434.js");
  var LinkText = (0, import_react78.createStyle)({
    textDecorationLine: "underline",
    color: "$info700",
    _dark: {
      color: "$info300"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Menu.ts
  var import_react79 = __require("./mock-20434.js");
  var Menu = (0, import_react79.createStyle)({
    ":initial": {
      opacity: 0
    },
    ":animate": {
      opacity: 1
    },
    ":exit": {
      opacity: 0
    },
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 250,
      opacity: {
        type: "timing",
        duration: 200
      }
    },
    "minWidth": 200,
    "py": "$2",
    "rounded": "$sm",
    "bg": "$backgroundLight0",
    "_dark": {
      bg: "$backgroundDark900"
    },
    "defaultProps": {
      softShadow: "3"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/MenuBackdrop.ts
  var import_react80 = __require("./mock-20434.js");
  var MenuBackdrop = (0, import_react80.createStyle)({
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // use this for when you want to give background colour to backdrop
    // opacity: 0.5,
    // bg: '$backgroundLight500',
    _web: {
      cursor: "default"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/MenuItem.ts
  var import_react81 = __require("./mock-20434.js");
  var MenuItem = (0, import_react81.createStyle)({
    "p": "$3",
    "flexDirection": "row",
    "alignItems": "center",
    ":hover": {
      bg: "$backgroundLight100"
    },
    ":disabled": {
      "opacity": 0.4,
      "_web": {
        cursor: "not-allowed"
      },
      ":focus": {
        bg: "transparent"
      },
      "_dark": {
        ":focus": {
          bg: "transparent"
        }
      }
    },
    ":active": {
      bg: "$backgroundLight200"
    },
    ":focus": {
      bg: "$backgroundLight100",
      // @ts-ignore
      outlineWidth: "$0",
      outlineStyle: "none"
    },
    ":focusVisible": {
      // @ts-ignore
      outlineWidth: "$0.5",
      outlineColor: "$primary700",
      outlineStyle: "solid",
      _dark: {
        outlineColor: "$primary300"
      }
    },
    "_dark": {
      ":hover": {
        bg: "$backgroundDark800"
      },
      ":active": {
        bg: "$backgroundDark700"
      },
      ":focus": {
        bg: "$backgroundDark800"
      }
    },
    "_web": {
      cursor: "pointer"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/MenuLabel.ts
  var import_react82 = __require("./mock-20434.js");
  var MenuLabel = (0, import_react82.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/MenuSeparator.ts
  var import_react83 = __require("./mock-20434.js");
  var MenuSeparator = (0, import_react83.createStyle)({
    bg: "$backgroundLight200",
    height: "$px",
    width: "$full",
    _dark: {
      bg: "$backgroundLight800"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Modal.ts
  var import_react84 = __require("./mock-20434.js");
  var Modal = (0, import_react84.createStyle)({
    width: "$full",
    height: "$full",
    justifyContent: "center",
    alignItems: "center",
    variants: {
      size: {
        xs: { _content: { width: "60%", maxWidth: 360 } },
        sm: { _content: { width: "70%", maxWidth: 420 } },
        md: { _content: { width: "80%", maxWidth: 510 } },
        lg: { _content: { width: "90%", maxWidth: 640 } },
        full: { _content: { width: "100%" } }
      }
    },
    defaultProps: { size: "md" },
    _web: {
      pointerEvents: "box-none"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ModalBackdrop.ts
  var import_react85 = __require("./mock-20434.js");
  var ModalBackdrop = (0, import_react85.createStyle)({
    ":initial": {
      opacity: 0
    },
    ":animate": {
      opacity: 0.5
    },
    ":exit": {
      opacity: 0
    },
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 250,
      opacity: {
        type: "timing",
        duration: 250
      }
    },
    "position": "absolute",
    "left": 0,
    "top": 0,
    "right": 0,
    "bottom": 0,
    "bg": "$backgroundLight950",
    // @ts-ignore
    "_dark": {
      bg: "$backgroundDark950"
    },
    // @ts-ignore
    "_web": {
      cursor: "default"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ModalBody.ts
  var import_react86 = __require("./mock-20434.js");
  var ModalBody = (0, import_react86.createStyle)({
    px: "$4",
    paddingTop: 0,
    paddingBottom: "$2"
  });

  // node_modules/@gluestack-ui/config/src/theme/ModalCloseButton.ts
  var import_react87 = __require("./mock-20434.js");
  var ModalCloseButton = (0, import_react87.createStyle)({
    "zIndex": 1,
    "p": "$2",
    "rounded": "$sm",
    "_icon": {
      color: "$backgroundLight400"
    },
    "_text": {
      color: "$backgroundLight400"
    },
    ":hover": {
      _icon: {
        color: "$backgroundLight700"
      },
      _text: {
        color: "$backgroundLight700"
      }
    },
    ":active": {
      _icon: {
        color: "$backgroundLight900"
      },
      _text: {
        color: "$backgroundLight900"
      }
    },
    "_dark": {
      "_icon": {
        color: "$backgroundDark400"
      },
      "_text": {
        color: "$backgroundDark400"
      },
      ":hover": {
        _icon: {
          color: "$backgroundDark200"
        },
        _text: {
          color: "$backgroundDark200"
        }
      },
      ":active": {
        _icon: {
          color: "$backgroundDark100"
        },
        _text: {
          color: "$backgroundDark100"
        }
      }
    },
    ":focusVisible": {
      bg: "$backgroundLight100",
      _icon: {
        color: "$backgroundLight900"
      },
      _text: {
        color: "$backgroundLight900"
      },
      _dark: {
        bg: "$backgroundDark700",
        _icon: {
          color: "$backgroundLight100"
        },
        _text: {
          color: "$backgroundLight100"
        }
      }
    },
    "_web": {
      outlineWidth: 0,
      cursor: "pointer"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ModalContent.ts
  var import_react88 = __require("./mock-20434.js");
  var ModalContent = (0, import_react88.createStyle)({
    "bg": "$backgroundLight50",
    "rounded": "$lg",
    "overflow": "hidden",
    ":initial": {
      opacity: 0,
      scale: 0.9
    },
    ":animate": {
      opacity: 1,
      scale: 1
    },
    ":exit": {
      opacity: 0
    },
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 250,
      opacity: {
        type: "timing",
        duration: 250
      }
    },
    // @ts-ignore
    "_dark": {
      bg: "$backgroundDark900"
    },
    "defaultProps": {
      softShadow: "3"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ModalFooter.ts
  var import_react89 = __require("./mock-20434.js");
  var ModalFooter = (0, import_react89.createStyle)({
    p: "$4",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap"
  });

  // node_modules/@gluestack-ui/config/src/theme/ModalHeader.ts
  var import_react90 = __require("./mock-20434.js");
  var ModalHeader = (0, import_react90.createStyle)({
    px: "$4",
    paddingTop: "$4",
    paddingBottom: "$2",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  });

  // node_modules/@gluestack-ui/config/src/theme/Popover.ts
  var import_react91 = __require("./mock-20434.js");
  var Popover = (0, import_react91.createStyle)({
    width: "$full",
    height: "$full",
    justifyContent: "center",
    alignItems: "center",
    variants: {
      size: {
        xs: { _content: { width: "60%", maxWidth: 360 } },
        sm: { _content: { width: "70%", maxWidth: 420 } },
        md: { _content: { width: "80%", maxWidth: 510 } },
        lg: { _content: { width: "90%", maxWidth: 640 } },
        full: { _content: { width: "100%" } }
      }
    },
    defaultProps: { size: "md" },
    _web: {
      pointerEvents: "box-none"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/PopoverArrow.ts
  var import_react92 = __require("./mock-20434.js");
  var PopoverArrow = (0, import_react92.createStyle)({
    "bg": "$backgroundLight50",
    "zIndex": 1,
    "position": "absolute",
    "overflow": "hidden",
    "_dark": {
      bg: "$backgroundDark900"
    },
    "h": "$3.5",
    "w": "$3.5",
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 250,
      mass: 0.9,
      opacity: {
        type: "timing",
        duration: 50,
        delay: 50
      }
    },
    "props": {
      softShadow: "3"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/PopoverBackdrop.ts
  var import_react93 = __require("./mock-20434.js");
  var PopoverBackdrop = (0, import_react93.createStyle)({
    ":initial": {
      opacity: 0
    },
    ":animate": {
      opacity: 0.1
    },
    ":exit": {
      opacity: 0
    },
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 450,
      mass: 0.9,
      opacity: {
        type: "timing",
        duration: 50,
        delay: 50
      }
    },
    "position": "absolute",
    "left": 0,
    "top": 0,
    "right": 0,
    "bottom": 0,
    "bg": "$backgroundLight950",
    "_dark": {
      bg: "$backgroundDark950"
    },
    "_web": {
      cursor: "default"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/PopoverBody.ts
  var import_react94 = __require("./mock-20434.js");
  var PopoverBody = (0, import_react94.createStyle)({
    p: "$4",
    pt: "$2"
  });

  // node_modules/@gluestack-ui/config/src/theme/PopoverCloseButton.ts
  var import_react95 = __require("./mock-20434.js");
  var PopoverCloseButton = (0, import_react95.createStyle)({
    "zIndex": 1,
    "p": "$2",
    "rounded": "$sm",
    "_icon": {
      color: "$backgroundLight400"
    },
    "_text": {
      color: "$backgroundLight400"
    },
    ":hover": {
      _icon: {
        color: "$backgroundLight700"
      },
      _text: {
        color: "$backgroundLight700"
      }
    },
    ":active": {
      _icon: {
        color: "$backgroundLight900"
      },
      _text: {
        color: "$backgroundLight900"
      }
    },
    "_dark": {
      "_icon": {
        color: "$backgroundDark400"
      },
      "_text": {
        color: "$backgroundDark400"
      },
      ":hover": {
        _icon: {
          color: "$backgroundDark200"
        },
        _text: {
          color: "$backgroundDark200"
        }
      },
      ":active": {
        _icon: {
          color: "$backgroundDark100"
        },
        _text: {
          color: "$backgroundDark100"
        }
      }
    },
    ":focusVisible": {
      bg: "$backgroundLight100",
      _icon: {
        color: "$backgroundLight900"
      },
      _text: {
        color: "$backgroundLight900"
      },
      _dark: {
        bg: "$backgroundDark700",
        _icon: {
          color: "$backgroundLight100"
        },
        _text: {
          color: "$backgroundLight100"
        }
      }
    },
    "_web": {
      outlineWidth: 0,
      cursor: "pointer"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/PopoverFooter.ts
  var import_react96 = __require("./mock-20434.js");
  var PopoverFooter = (0, import_react96.createStyle)({
    p: "$4",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
    borderTopWidth: 1,
    borderColor: "$borderLight300",
    _dark: {
      borderColor: "$borderDark700"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/PopoverHeader.ts
  var import_react97 = __require("./mock-20434.js");
  var PopoverHeader = (0, import_react97.createStyle)({
    p: "$4",
    pb: "$2",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  });

  // node_modules/@gluestack-ui/config/src/theme/PopoverContent.ts
  var import_react98 = __require("./mock-20434.js");
  var PopoverContent = (0, import_react98.createStyle)({
    "bg": "$backgroundLight50",
    "rounded": "$lg",
    "overflow": "hidden",
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 250,
      mass: 0.9,
      opacity: {
        type: "timing",
        duration: 50,
        delay: 50
      }
    },
    "_dark": {
      bg: "$backgroundDark900"
    },
    "defaultProps": {
      softShadow: "3"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Pressable.ts
  var import_react99 = __require("./mock-20434.js");
  var Pressable = (0, import_react99.createStyle)({
    _web: {
      ":focusVisible": {
        outlineWidth: "2px",
        outlineColor: "$primary700",
        outlineStyle: "solid",
        _dark: {
          outlineColor: "$primary300"
        }
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Progress.ts
  var import_react100 = __require("./mock-20434.js");
  var Progress = (0, import_react100.createStyle)({
    bg: "$backgroundLight300",
    borderRadius: "$full",
    w: "100%",
    variants: {
      size: {
        "xs": {
          h: "$1",
          _filledTrack: {
            h: "$1"
          }
        },
        "sm": {
          h: "$2",
          _filledTrack: {
            h: "$2"
          }
        },
        "md": {
          h: "$3",
          _filledTrack: {
            h: "$3"
          }
        },
        "lg": {
          h: "$4",
          _filledTrack: {
            h: "$4"
          }
        },
        "xl": {
          h: "$5",
          _filledTrack: {
            h: "$5"
          }
        },
        "2xl": {
          h: "$6",
          _filledTrack: {
            h: "$6"
          }
        }
      }
    },
    _dark: {
      bg: "$backgroundDark700"
    },
    defaultProps: {
      size: "md"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ProgressFilledTrack.ts
  var import_react101 = __require("./mock-20434.js");
  var ProgressFilledTrack = (0, import_react101.createStyle)({
    bg: "$primary500",
    borderRadius: "$full",
    _dark: {
      bg: "$primary400"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Radio.ts
  var import_react102 = __require("./mock-20434.js");
  var Radio = (0, import_react102.createStyle)({
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    variants: {
      size: {
        lg: {
          _text: {
            props: {
              size: "lg"
            }
          },
          _icon: {
            props: {
              size: "md"
            }
          },
          _indicator: {
            p: 2,
            h: "$6",
            w: "$6"
          }
        },
        md: {
          _text: {
            props: {
              size: "md"
            }
          },
          _icon: {
            props: {
              size: "sm"
            }
          },
          _indicator: {
            p: 1.5,
            h: "$5",
            w: "$5"
          }
        },
        sm: {
          _text: {
            props: {
              size: "sm"
            }
          },
          _icon: {
            props: {
              size: "2xs"
            }
          },
          _indicator: {
            p: 1,
            h: "$4",
            w: "$4"
          }
        }
      }
    },
    defaultProps: {
      size: "md"
    },
    _web: {
      "cursor": "pointer",
      ":disabled": {
        cursor: "not-allowed"
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/RadioGroup.ts
  var import_react103 = __require("./mock-20434.js");
  var RadioGroup = (0, import_react103.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/RadioIcon.ts
  var import_react104 = __require("./mock-20434.js");
  var RadioIcon = (0, import_react104.createStyle)({
    "borderRadius": "$full",
    ":checked": {
      "color": "$primary600",
      ":hover": {
        "color": "$primary700",
        ":disabled": {
          color: "$primary600"
        }
      }
    },
    "_dark": {
      ":checked": {
        "color": "$primary500",
        ":disabled": {
          color: "$primary500"
        },
        ":hover": {
          ":disabled": {
            color: "$primary500"
          },
          "color": "$primary400"
        }
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/RadioIndicator.ts
  var import_react105 = __require("./mock-20434.js");
  var RadioIndicator = (0, import_react105.createStyle)({
    "justifyContent": "center",
    "alignItems": "center",
    "bg": "transparent",
    "borderColor": "$borderLight400",
    "borderWidth": 2,
    "borderRadius": 999,
    "_web": {
      ":focusVisible": {
        outlineWidth: 2,
        outlineColor: "$primary700",
        outlineStyle: "solid",
        _dark: {
          outlineColor: "$primary400"
        }
      }
    },
    ":checked": {
      borderColor: "$primary600",
      bg: "transparent"
    },
    ":hover": {
      "borderColor": "$borderLight500",
      "bg": "transparent",
      ":checked": {
        bg: "transparent",
        borderColor: "$primary700"
      },
      ":invalid": {
        borderColor: "$error700"
      },
      ":disabled": {
        ":invalid": {
          borderColor: "$error400",
          opacity: 0.4
        },
        "borderColor": "$borderLight400",
        "opacity": 0.4
      }
    },
    ":active": {
      bg: "transparent",
      borderColor: "$primary800"
    },
    "_dark": {
      "borderColor": "$borderDark500",
      "bg": "$transparent",
      ":hover": {
        "borderColor": "$borderDark400",
        "bg": "transparent",
        ":checked": {
          bg: "transparent",
          borderColor: "$primary400"
        },
        ":invalid": {
          borderColor: "$error400"
        },
        ":disabled": {
          "borderColor": "$borderDark500",
          "opacity": 0.4,
          ":checked": {
            bg: "transparent",
            borderColor: "$primary500"
          },
          ":invalid": {
            borderColor: "$error400"
          }
        }
      },
      ":checked": {
        borderColor: "$primary500"
      },
      ":active": {
        bg: "transparent",
        borderColor: "$primary300"
      },
      ":invalid": {
        borderColor: "$error400"
      }
    },
    ":invalid": {
      borderColor: "$error700"
    },
    ":disabled": {
      "opacity": 0.4,
      ":checked": {
        borderColor: "$borderLight400",
        bg: "transparent"
      },
      ":invalid": {
        borderColor: "$error400"
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/RadioLabel.ts
  var import_react106 = __require("./mock-20434.js");
  var RadioLabel = (0, import_react106.createStyle)({
    "color": "$textLight600",
    ":checked": {
      color: "$textLight900"
    },
    ":hover": {
      "color": "$textLight900",
      ":checked": {
        color: "$textLight900"
      },
      ":disabled": {
        "color": "$textLight600",
        ":checked": {
          color: "$textLight900"
        }
      }
    },
    ":active": {
      "color": "$textLight900",
      ":checked": {
        color: "$textLight900"
      }
    },
    ":disabled": {
      opacity: 0.4
    },
    "_web": {
      MozUserSelect: "none",
      WebkitUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none"
    },
    "_dark": {
      "color": "$textDark400",
      ":checked": {
        color: "$textDark100"
      },
      ":hover": {
        "color": "$textDark100",
        ":checked": {
          color: "$textDark100"
        },
        ":disabled": {
          "color": "$textDark400",
          ":checked": {
            color: "$textDark100"
          }
        }
      },
      ":active": {
        "color": "$textDark100",
        ":checked": {
          color: "$textDark100"
        }
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ScrollView.ts
  var import_react107 = __require("./mock-20434.js");
  var ScrollView = (0, import_react107.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/SectionList.ts
  var import_react108 = __require("./mock-20434.js");
  var SectionList = (0, import_react108.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/Select.ts
  var import_react109 = __require("./mock-20434.js");
  var Select = (0, import_react109.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/SelectActionsheet.ts
  var import_react110 = __require("./mock-20434.js");
  var SelectActionsheet = (0, import_react110.createStyle)({
    width: "$full",
    height: "$full",
    justifyContent: "flex-end",
    alignItems: "center",
    _web: {
      pointerEvents: "none"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/SelectActionsheetBackdrop.ts
  var import_react111 = __require("./mock-20434.js");
  var SelectActionsheetBackdrop = (0, import_react111.createStyle)({
    ":initial": {
      opacity: 0
    },
    ":animate": {
      opacity: 0.5
    },
    ":exit": {
      opacity: 0
    },
    "position": "absolute",
    "left": 0,
    "top": 0,
    "right": 0,
    "bottom": 0,
    "bg": "$backgroundLight950",
    // @ts-ignore
    "_dark": {
      bg: "$backgroundDark950"
    },
    // @ts-ignore
    "_web": {
      cursor: "default"
    },
    "pointerEvents": "auto"
  });

  // node_modules/@gluestack-ui/config/src/theme/SelectActionsheetContent.ts
  var import_react112 = __require("./mock-20434.js");
  var SelectActionsheetContent = (0, import_react112.createStyle)({
    alignItems: "center",
    borderTopLeftRadius: "$3xl",
    borderTopRightRadius: "$3xl",
    maxHeight: "70%",
    p: "$2",
    bg: "$backgroundLight0",
    _sectionHeaderBackground: {
      bg: "$backgroundLight0"
    },
    // @ts-ignore
    _dark: {
      bg: "$backgroundDark900",
      _sectionHeaderBackground: {
        bg: "$backgroundDark900"
      }
    },
    pointerEvents: "auto",
    _web: {
      userSelect: "none"
    },
    defaultProps: {
      hardShadow: "5"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/SelectActionsheetDragIndicator.ts
  var import_react113 = __require("./mock-20434.js");
  var SelectActionsheetDragIndicator = (0, import_react113.createStyle)({
    height: "$1",
    width: "$16",
    bg: "$backgroundLight400",
    rounded: "$full",
    _dark: {
      bg: "$backgroundDark500"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/SelectActionsheetFlatList.ts
  var import_react114 = __require("./mock-20434.js");
  var SelectActionsheetFlatList = (0, import_react114.createStyle)({
    w: "$full",
    h: "auto"
  });

  // node_modules/@gluestack-ui/config/src/theme/SelectActionsheetIcon.ts
  var import_react115 = __require("./mock-20434.js");
  var SelectActionsheetIcon = (0, import_react115.createStyle)({
    w: "$4",
    h: "$4",
    mr: "$2",
    color: "$backgroundLight500",
    _dark: {
      //@ts-ignore
      color: "$backgroundDark400"
    },
    props: {
      size: "md"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/SelectActionsheetIndicatorWrapper.ts
  var import_react116 = __require("./mock-20434.js");
  var SelectActionsheetIndicatorWrapper = (0, import_react116.createStyle)({
    py: "$1",
    w: "$full",
    alignItems: "center"
  });

  // node_modules/@gluestack-ui/config/src/theme/SelectActionsheetItem.ts
  var import_react117 = __require("./mock-20434.js");
  var SelectActionsheetItem = (0, import_react117.createStyle)({
    "p": "$3",
    "flexDirection": "row",
    "alignItems": "center",
    "rounded": "$sm",
    "w": "$full",
    ":disabled": {
      opacity: 0.4,
      _web: {
        // @ts-ignore
        pointerEvents: "all !important",
        cursor: "not-allowed"
      }
    },
    ":hover": {
      bg: "$backgroundLight100"
    },
    ":active": {
      bg: "$backgroundLight200"
    },
    ":checked": {
      bg: "$backgroundLight300"
    },
    ":focus": {
      bg: "$backgroundLight100"
    },
    "_dark": {
      ":hover": {
        bg: "$backgroundDark800"
      },
      ":active": {
        bg: "$backgroundDark700"
      },
      ":focus": {
        bg: "$backgroundDark800"
      }
    },
    "_web": {
      ":focusVisible": {
        bg: "$backgroundLight100",
        _dark: {
          bg: "$backgroundDark700"
        }
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/SelectActionsheetItemText.ts
  var import_react118 = __require("./mock-20434.js");
  var SelectActionsheetItemText = (0, import_react118.createStyle)({
    mx: "$2",
    fontSize: "$md",
    fontFamily: "$body",
    fontWeight: "$normal",
    lineHeight: "$md",
    color: "$textLight700",
    _dark: {
      color: "$textDark200"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/SelectActionsheetScrollView.ts
  var import_react119 = __require("./mock-20434.js");
  var SelectActionsheetScrollView = (0, import_react119.createStyle)({
    w: "$full",
    h: "auto"
  });

  // node_modules/@gluestack-ui/config/src/theme/SelectActionsheetSectionHeaderText.ts
  var import_react120 = __require("./mock-20434.js");
  var SelectActionsheetSectionHeaderText = (0, import_react120.createStyle)({
    color: "$textLight500",
    fontSize: "$sm",
    fontFamily: "$body",
    fontWeight: "$bold",
    lineHeight: "$xs",
    textTransform: "uppercase",
    p: "$3",
    _dark: {
      color: "$textDark400"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/SelectActionsheetSectionList.ts
  var import_react121 = __require("./mock-20434.js");
  var SelectActionsheetSectionList = (0, import_react121.createStyle)({
    w: "$full",
    h: "auto"
  });

  // node_modules/@gluestack-ui/config/src/theme/SelectActionsheetVirtualizedList.ts
  var import_react122 = __require("./mock-20434.js");
  var SelectActionsheetVirtualizedList = (0, import_react122.createStyle)({
    w: "$full",
    h: "auto"
  });

  // node_modules/@gluestack-ui/config/src/theme/SelectIcon.ts
  var import_react123 = __require("./mock-20434.js");
  var SelectIcon = (0, import_react123.createStyle)({
    props: {
      size: "md"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/SelectInput.ts
  var import_react124 = __require("./mock-20434.js");
  var SelectInput = (0, import_react124.createStyle)({
    _web: {
      w: "$full"
    },
    pointerEvents: "none",
    flex: 1,
    h: "$full",
    color: "$textLight900",
    props: {
      placeholderTextColor: "$textLight500"
    },
    _dark: {
      color: "$textDark50",
      props: {
        placeholderTextColor: "$textDark400"
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/SelectTrigger.ts
  var import_react125 = __require("./mock-20434.js");
  var SelectTrigger = (0, import_react125.createStyle)({
    "borderWidth": 1,
    "borderColor": "$backgroundLight300",
    "borderRadius": "$sm",
    "flexDirection": "row",
    "overflow": "hidden",
    "alignItems": "center",
    ":hover": {
      borderColor: "$borderLight400"
    },
    ":focus": {
      borderColor: "$primary700"
    },
    ":disabled": {
      "opacity": 0.4,
      ":hover": {
        borderColor: "$backgroundLight300"
      }
    },
    "_input": {
      py: "auto",
      px: "$3"
    },
    "_icon": {
      color: "$backgroundLight500",
      _dark: {
        color: "$backgroundLight500"
      }
    },
    "_dark": {
      "borderColor": "$borderDark700",
      ":hover": {
        borderColor: "$borderDark400"
      },
      ":focus": {
        borderColor: "$primary400"
      },
      ":disabled": {
        ":hover": {
          borderColor: "$borderDark700"
        }
      }
    },
    "variants": {
      size: {
        xl: {
          h: "$12",
          _input: {
            fontSize: "$xl"
          },
          _icon: {
            h: "$6",
            w: "$6"
          }
        },
        lg: {
          h: "$11",
          _input: {
            fontSize: "$lg"
          },
          _icon: {
            h: "$5",
            w: "$5"
          }
        },
        md: {
          h: "$10",
          _input: {
            fontSize: "$md"
          },
          _icon: {
            h: "$4",
            w: "$4"
          }
        },
        sm: {
          h: "$9",
          _input: {
            fontSize: "$sm"
          },
          _icon: {
            h: "$3.5",
            w: "$3.5"
          }
        }
      },
      variant: {
        underlined: {
          "_input": {
            _web: {
              outlineWidth: 0,
              outline: "none"
            },
            px: "$0"
          },
          "borderWidth": 0,
          "borderRadius": 0,
          "borderBottomWidth": "$1",
          ":focus": {
            "borderColor": "$primary700",
            "_web": {
              boxShadow: "inset 0 -1px 0 0 $primary700"
            },
            ":hover": {
              borderColor: "$primary700",
              _web: {
                boxShadow: "inset 0 -1px 0 0 $primary600"
              }
            }
          },
          ":invalid": {
            "borderBottomWidth": 2,
            "borderBottomColor": "$error700",
            "_web": {
              boxShadow: "inset 0 -1px 0 0 $error700"
            },
            ":hover": {
              borderBottomColor: "$error700"
            },
            ":focus": {
              "borderBottomColor": "$error700",
              ":hover": {
                borderBottomColor: "$error700",
                _web: {
                  boxShadow: "inset 0 -1px 0 0 $error700"
                }
              }
            },
            ":disabled": {
              ":hover": {
                borderBottomColor: "$error700",
                _web: {
                  boxShadow: "inset 0 -1px 0 0 $error700"
                }
              }
            }
          },
          "_dark": {
            ":focus": {
              borderColor: "$primary400",
              _web: {
                boxShadow: "inset 0 -1px 0 0 $primary400"
              }
            },
            ":invalid": {
              "borderColor": "$error400",
              "_web": {
                boxShadow: "inset 0 -1px 0 0 $error400"
              },
              ":hover": {
                borderBottomColor: "$error400"
              },
              ":focus": {
                "borderBottomColor": "$error400",
                ":hover": {
                  borderBottomColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 -1px 0 0 $error400"
                  }
                }
              },
              ":disabled": {
                ":hover": {
                  borderBottomColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 -1px 0 0 $error400"
                  }
                }
              }
            }
          }
        },
        outline: {
          "_input": {
            _web: {
              outlineWidth: 0,
              outline: "none"
            }
          },
          ":focus": {
            "borderColor": "$primary700",
            "_web": {
              boxShadow: "inset 0 0 0 1px $primary700"
            },
            ":hover": {
              borderColor: "$primary700",
              _web: {
                boxShadow: "inset 0 0 0 1px $primary600"
              }
            }
          },
          ":invalid": {
            "borderColor": "$error700",
            "_web": {
              boxShadow: "inset 0 0 0 1px $error700"
            },
            ":hover": {
              borderColor: "$error700"
            },
            ":focus": {
              "borderColor": "$error700",
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            },
            ":disabled": {
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            }
          },
          "_dark": {
            ":focus": {
              borderColor: "$primary400",
              _web: {
                boxShadow: "inset 0 0 0 1px $primary400"
              }
            },
            ":invalid": {
              "borderColor": "$error400",
              "_web": {
                boxShadow: "inset 0 0 0 1px $error400"
              },
              ":hover": {
                borderColor: "$error400"
              },
              ":focus": {
                "borderColor": "$error400",
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              },
              ":disabled": {
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              }
            }
          }
        },
        rounded: {
          "borderRadius": 999,
          "_input": {
            px: "$4",
            _web: {
              outlineWidth: 0,
              outline: "none"
            }
          },
          ":focus": {
            "borderColor": "$primary700",
            "_web": {
              boxShadow: "inset 0 0 0 1px $primary700"
            },
            ":hover": {
              borderColor: "$primary700",
              _web: {
                boxShadow: "inset 0 0 0 1px $primary600"
              }
            }
          },
          ":invalid": {
            "borderColor": "$error700",
            "_web": {
              boxShadow: "inset 0 0 0 1px $error700"
            },
            ":hover": {
              borderColor: "$error700"
            },
            ":focus": {
              "borderColor": "$error700",
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            },
            ":disabled": {
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            }
          },
          "_dark": {
            ":focus": {
              borderColor: "$primary400",
              _web: {
                boxShadow: "inset 0 0 0 1px $primary400"
              }
            },
            ":invalid": {
              "borderColor": "$error400",
              "_web": {
                boxShadow: "inset 0 0 0 1px $error400"
              },
              ":hover": {
                borderColor: "$error400"
              },
              ":focus": {
                "borderColor": "$error400",
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              },
              ":disabled": {
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              }
            }
          }
        }
      }
    },
    "defaultProps": {
      size: "md",
      variant: "outline"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Slider.ts
  var import_react126 = __require("./mock-20434.js");
  var Slider = (0, import_react126.createStyle)({
    justifyContent: "center",
    alignItems: "center",
    variants: {
      orientation: {
        horizontal: {
          w: "$full",
          _track: {
            width: "$full"
          },
          _filledTrack: {
            height: "$full"
          }
        },
        vertical: {
          h: "$full",
          _track: {
            height: "$full"
          },
          _filledTrack: {
            width: "$full"
          }
        }
      },
      isReversed: {
        true: {},
        false: {}
      },
      size: {
        sm: {
          _thumb: {
            h: "$4",
            w: "$4"
          }
        },
        md: {
          _thumb: {
            h: "$5",
            w: "$5"
          }
        },
        lg: {
          _thumb: {
            h: "$6",
            w: "$6"
          }
        }
      }
    },
    compoundVariants: [
      {
        orientation: "horizontal",
        size: "sm",
        value: {
          _track: {
            height: "$1",
            flexDirection: "row"
          }
        }
      },
      {
        orientation: "horizontal",
        size: "sm",
        isReversed: true,
        value: {
          _track: {
            height: "$1",
            flexDirection: "row-reverse"
          }
        }
      },
      {
        orientation: "horizontal",
        size: "md",
        value: {
          _track: {
            height: 5,
            flexDirection: "row"
          }
        }
      },
      {
        orientation: "horizontal",
        size: "md",
        isReversed: true,
        value: {
          _track: {
            height: 5,
            flexDirection: "row-reverse"
          }
        }
      },
      {
        orientation: "horizontal",
        size: "lg",
        value: {
          _track: {
            height: "$1.5",
            flexDirection: "row"
          }
        }
      },
      {
        orientation: "horizontal",
        size: "lg",
        isReversed: true,
        value: {
          _track: {
            height: "$1.5",
            flexDirection: "row-reverse"
          }
        }
      },
      {
        orientation: "vertical",
        size: "sm",
        value: {
          _track: {
            w: "$1",
            flexDirection: "column-reverse"
          }
        }
      },
      {
        orientation: "vertical",
        size: "sm",
        isReversed: true,
        value: {
          _track: {
            width: "$1",
            flexDirection: "column"
          }
        }
      },
      {
        orientation: "vertical",
        size: "md",
        value: {
          _track: {
            width: 5,
            flexDirection: "column-reverse"
          }
        }
      },
      {
        orientation: "vertical",
        size: "md",
        isReversed: true,
        value: {
          _track: {
            width: 5,
            flexDirection: "column"
          }
        }
      },
      {
        orientation: "vertical",
        size: "lg",
        value: {
          _track: {
            width: "$1.5",
            flexDirection: "column-reverse"
          }
        }
      },
      {
        orientation: "vertical",
        size: "lg",
        isReversed: true,
        value: {
          _track: {
            width: "$1.5",
            flexDirection: "column"
          }
        }
      }
    ],
    _web: {
      ":disabled": {
        // @ts-ignore
        pointerEvents: "all !important",
        cursor: "not-allowed",
        opacity: 0.4
      }
    },
    defaultProps: {
      size: "md",
      orientation: "horizontal"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/SliderFilledTrack.ts
  var import_react127 = __require("./mock-20434.js");
  var SliderFilledTrack = (0, import_react127.createStyle)({
    "bg": "$primary500",
    "_dark": {
      bg: "$primary400"
    },
    ":focus": {
      bg: "$primary600",
      _dark: {
        bg: "$primary300"
      }
    },
    ":active": {
      bg: "$primary600",
      _dark: {
        bg: "$primary300"
      }
    },
    ":hover": {
      bg: "$primary600",
      _dark: {
        bg: "$primary300"
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/SliderThumb.ts
  var import_react128 = __require("./mock-20434.js");
  var SliderThumb = (0, import_react128.createStyle)({
    "bg": "$primary500",
    "_dark": {
      bg: "$primary400"
    },
    "position": "absolute",
    "borderRadius": "$full",
    ":focus": {
      bg: "$primary600",
      _dark: {
        bg: "$primary300"
      }
    },
    ":active": {
      bg: "$primary600",
      _dark: {
        bg: "$primary300"
      }
    },
    ":hover": {
      bg: "$primary600",
      _dark: {
        bg: "$primary300"
      }
    },
    ":disabled": {
      bg: "$primary500",
      _dark: {
        bg: "$primary500"
      }
    },
    "_web": {
      //@ts-ignore
      "cursor": "pointer",
      ":active": {
        outlineWidth: 4,
        outlineStyle: "solid",
        outlineColor: "$primary400",
        _dark: {
          outlineColor: "$primary500"
        }
      },
      ":focus": {
        outlineWidth: 4,
        outlineStyle: "solid",
        outlineColor: "$primary400",
        _dark: {
          outlineColor: "$primary500"
        }
      }
    },
    "defaultProps": {
      hardShadow: "1"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/SliderThumbInteraction.ts
  var import_react129 = __require("./mock-20434.js");
  var SliderThumbInteraction = (0, import_react129.createStyle)({
    borderRadius: 9999,
    zIndex: -1
  });

  // node_modules/@gluestack-ui/config/src/theme/SliderTrack.ts
  var import_react130 = __require("./mock-20434.js");
  var SliderTrack = (0, import_react130.createStyle)({
    // h: '100%',
    // w: '100%',
    bg: "$backgroundLight300",
    _dark: {
      bg: "$backgroundDark700"
    },
    borderRadius: "$lg",
    overflow: "hidden",
    variants: {
      variant: {
        horizontal: {
          width: "100%"
        },
        vertical: {
          height: "100%"
        }
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Spinner.ts
  var import_react131 = __require("./mock-20434.js");
  var Spinner = (0, import_react131.createStyle)({
    props: {
      color: "$primary500"
    },
    _dark: {
      props: {
        color: "$primary400"
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/StatusBar.ts
  var import_react132 = __require("./mock-20434.js");
  var StatusBar = (0, import_react132.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/Switch.ts
  var import_react133 = __require("./mock-20434.js");
  var Switch = (0, import_react133.createStyle)({
    "props": {
      // todo: add support for this in style.gluestack.io
      // trackColor: { false: '$backgroundLight300', true: '$primary600' },
      // hacky fix for the above
      //@ts-ignore
      trackColor: { false: "$backgroundLight300", true: "$primary600" },
      thumbColor: "$backgroundLight0",
      //@ts-ignore
      activeThumbColor: "$backgroundLight0",
      // for ios specifically in unchecked state
      ios_backgroundColor: "$backgroundLight300"
    },
    "borderRadius": "$full",
    "variants": {
      //@ts-ignore
      size: {
        sm: {
          transform: [
            {
              scale: 0.75
            }
          ]
        },
        md: {},
        lg: {
          transform: [
            {
              scale: 1.25
            }
          ]
        }
      }
    },
    "_web": {
      ":focus": {
        outlineWidth: 0,
        outlineColor: "$primary700",
        outlineStyle: "solid",
        _dark: {
          // @ts-ignore
          outlineColor: "$primary600",
          outlineWidth: 0,
          outlineStyle: "solid"
        }
      }
    },
    "defaultProps": {
      size: "md"
    },
    ":disabled": {
      "_web": {
        "cursor": "pointer",
        ":disabled": {
          cursor: "not-allowed"
        }
      },
      "opacity": 0.4,
      //@ts-ignore
      "trackColor": { false: "$backgroundLight300", true: "$primary600" },
      // for ios specifically in unchecked state
      "ios_backgroundColor": "$backgroundLight300",
      ":hover": {
        props: {
          //@ts-ignore
          trackColor: { false: "$backgroundLight300", true: "$primary600" }
        }
      }
    },
    ":invalid": {
      borderColor: "$error700",
      borderRadius: 12,
      borderWidth: 2
    },
    ":hover": {
      "props": {
        // todo: add support for this in style.gluestack.io
        // trackColor: { false: '$backgroundLight400', true: '$primary700' },
        // hacky fix for the above
        //@ts-ignore
        trackColor: { false: "$backgroundLight400", true: "$primary700" },
        ios_backgroundColor: "$backgroundLight400"
      },
      ":invalid": {
        props: {
          // todo: add support for this in style.gluestack.io
          // trackColor: { false: '$backgroundLight400', true: '$primary700' },
          // hacky fix for the above
          //@ts-ignore
          trackColor: { false: "$backgroundLight300", true: "$primary700" }
        }
      }
    },
    ":checked": {
      props: {
        //@ts-ignore
        thumbColor: "$backgroundLight0"
      }
    },
    "_dark": {
      "props": {
        //@ts-ignore
        trackColor: { false: "$backgroundDark700", true: "$primary500" },
        thumbColor: "$backgroundDark0",
        //@ts-ignore
        activeThumbColor: "$backgroundDark0"
      },
      ":invalid": {
        borderColor: "$error400",
        borderRadius: 12,
        borderWidth: 2
      },
      ":hover": {
        "props": {
          //@ts-ignore
          trackColor: { false: "$backgroundDark600", true: "$primary600" },
          ios_backgroundColor: "$backgroundLight400"
        },
        ":invalid": {
          props: {
            // todo: add support for this in style.gluestack.io
            // trackColor: { false: '$backgroundLight400', true: '$primary700' },
            // hacky fix for the above
            //@ts-ignore
            trackColor: { false: "$backgroundDark700", true: "$primary600" }
          }
        }
      },
      ":disabled": {
        "_web": {
          "cursor": "pointer",
          ":disabled": {
            cursor: "not-allowed"
          }
        },
        "opacity": 0.4,
        //@ts-ignore
        "trackColor": { false: "$backgroundLight300", true: "$primary500" },
        // for ios specifically in unchecked state
        "ios_backgroundColor": "$backgroundLight300",
        ":hover": {
          props: {
            //@ts-ignore
            trackColor: { false: "$backgroundDark700", true: "$primary500" }
          }
        }
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Tabs.ts
  var import_react134 = __require("./mock-20434.js");
  var Tabs = (0, import_react134.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/TabsTab.ts
  var import_react135 = __require("./mock-20434.js");
  var TabsTab = (0, import_react135.createStyle)({
    "bg": "transparent",
    "_web": {
      outlineWidth: 0
    },
    "variants": {
      size: {
        md: {
          px: "$4",
          py: "$2",
          _text: {
            fontSize: "$md",
            lineHeight: "$md"
          }
        }
      }
    },
    "defaultProps": {
      size: "md"
    },
    ":hover": {
      // bg: '$secondary50_alpha_20',
      borderRadius: "$full"
    },
    ":active": {
      // bg: '$secondary50_alpha_10',
      borderRadius: "$full"
    },
    ":focus": {
      // bg: '$secondary50_alpha_20',
      borderRadius: "$full"
    },
    ":disabled": {
      opacity: 0.5
    },
    "_dark": {
      ":hover": {
        bg: "$backgroundLight500",
        borderRadius: "$full"
      },
      ":active": {
        bg: "$backgroundLight400",
        borderRadius: "$full"
      },
      ":focus": {
        bg: "$backgroundLight400",
        borderRadius: "$full"
      },
      ":disabled": {
        opacity: 0.5
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/TabsTabIcon.ts
  var import_react136 = __require("./mock-20434.js");
  var TabsTabIcon = (0, import_react136.createStyle)({
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    mr: 12
  });

  // node_modules/@gluestack-ui/config/src/theme/TabsTabList.ts
  var import_react137 = __require("./mock-20434.js");
  var TabsTabList = (0, import_react137.createStyle)({
    flexDirection: "row",
    alignSelf: "flex-start",
    // bg: 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%) , rgba(255, 255, 255, 0.04);',
    rounded: "$full"
  });

  // node_modules/@gluestack-ui/config/src/theme/TabsTabPanel.ts
  var import_react138 = __require("./mock-20434.js");
  var TabsTabPanel = (0, import_react138.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/TabsTabPanels.ts
  var import_react139 = __require("./mock-20434.js");
  var TabsTabPanels = (0, import_react139.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/TabsTabTitle.ts
  var import_react140 = __require("./mock-20434.js");
  var TabsTabTitle = (0, import_react140.createStyle)({
    fontFamily: "$body"
  });

  // node_modules/@gluestack-ui/config/src/theme/Text.ts
  var import_react141 = __require("./mock-20434.js");
  var Text = (0, import_react141.createStyle)({
    color: "$textLight700",
    _dark: {
      color: "$textDark200"
    },
    fontWeight: "$normal",
    fontFamily: "$body",
    fontStyle: "normal",
    letterSpacing: "$md",
    variants: {
      isTruncated: {
        true: {
          props: {
            // @ts-ignore
            numberOfLines: 1,
            ellipsizeMode: "tail"
          }
        }
      },
      bold: {
        true: {
          fontWeight: "$bold"
        }
      },
      underline: {
        true: {
          textDecorationLine: "underline"
        }
      },
      strikeThrough: {
        true: {
          textDecorationLine: "line-through"
        }
      },
      sub: {
        true: {
          fontSize: "$xs",
          lineHeight: "$xs"
        }
      },
      italic: {
        true: {
          fontStyle: "italic"
        }
      },
      highlight: {
        true: {
          bg: "$yellow500"
        }
      },
      size: {
        "2xs": {
          fontSize: "$2xs",
          lineHeight: "$2xs"
        },
        "xs": {
          fontSize: "$xs",
          lineHeight: "$sm"
        },
        "sm": {
          fontSize: "$sm",
          lineHeight: "$sm"
        },
        "md": {
          fontSize: "$md"
          /**
           * @todo Fix the lineHeight issue
           * https://github.com/gluestack/gluestack-ui/issues/1836
           */
          // lineHeight: '$md',
        },
        "lg": {
          fontSize: "$lg",
          lineHeight: "$xl"
        },
        "xl": {
          fontSize: "$xl",
          lineHeight: "$xl"
        },
        "2xl": {
          fontSize: "$2xl",
          lineHeight: "$2xl"
        },
        "3xl": {
          fontSize: "$3xl",
          lineHeight: "$3xl"
        },
        "4xl": {
          fontSize: "$4xl",
          lineHeight: "$4xl"
        },
        "5xl": {
          fontSize: "$5xl",
          lineHeight: "$6xl"
        },
        "6xl": {
          fontSize: "$6xl",
          lineHeight: "$7xl"
        }
      }
    },
    defaultProps: {
      size: "md"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Textarea.ts
  var import_react142 = __require("./mock-20434.js");
  var Textarea = (0, import_react142.createStyle)({
    "w": "100%",
    "borderWidth": 1,
    "borderColor": "$backgroundLight300",
    "borderRadius": "$sm",
    "h": 100,
    "_input": {
      p: "$3",
      _web: {
        outlineWidth: 0,
        outline: "none"
      }
    },
    ":hover": {
      borderColor: "$borderLight400"
    },
    ":focus": {
      "borderColor": "$primary700",
      ":hover": {
        borderColor: "$primary700"
      }
    },
    ":disabled": {
      "opacity": 0.4,
      ":hover": {
        borderColor: "$backgroundLight300"
      }
    },
    "_dark": {
      "borderColor": "$borderDark700",
      ":hover": {
        borderColor: "$borderDark600"
      },
      ":focus": {
        "borderColor": "$primary400",
        ":hover": {
          borderColor: "$primary400"
        }
      },
      ":disabled": {
        ":hover": {
          borderColor: "$borderDark700"
        }
      }
    },
    "variants": {
      size: {
        xl: {
          _input: {
            fontSize: "$xl"
          }
        },
        lg: {
          _input: {
            fontSize: "$lg"
          }
        },
        md: {
          _input: {
            fontSize: "$md"
          }
        },
        sm: {
          _input: {
            fontSize: "$sm"
          }
        }
      },
      variant: {
        default: {
          "_input": {
            _web: {
              outlineWidth: "0",
              outline: "none"
            }
          },
          ":focus": {
            borderColor: "$primary700",
            _web: {
              boxShadow: "inset 0 0 0 1px $primary700"
            }
          },
          ":invalid": {
            "borderColor": "$error700",
            "_web": {
              boxShadow: "inset 0 0 0 1px $error700"
            },
            ":hover": {
              borderColor: "$error700"
            },
            ":focus": {
              ":hover": {
                borderColor: "$primary700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $primary700"
                }
              }
            },
            ":disabled": {
              ":hover": {
                borderColor: "$error700",
                _web: {
                  boxShadow: "inset 0 0 0 1px $error700"
                }
              }
            }
          },
          "_dark": {
            ":focus": {
              borderColor: "$primary400",
              _web: {
                boxShadow: "inset 0 0 0 1px $primary400"
              }
            },
            ":invalid": {
              "borderColor": "$error400",
              "_web": {
                boxShadow: "inset 0 0 0 1px $error400"
              },
              ":hover": {
                borderColor: "$error400"
              },
              ":focus": {
                ":hover": {
                  borderColor: "$primary400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $primary400"
                  }
                }
              },
              ":disabled": {
                ":hover": {
                  borderColor: "$error400",
                  _web: {
                    boxShadow: "inset 0 0 0 1px $error400"
                  }
                }
              }
            }
          }
        }
      }
    },
    "defaultProps": {
      variant: "default",
      size: "md"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/TextareaInput.ts
  var import_react143 = __require("./mock-20434.js");
  var TextareaInput = (0, import_react143.createStyle)({
    p: "$2",
    color: "$textLight900",
    textAlignVertical: "top",
    flex: 1,
    props: {
      // @ts-ignore
      multiline: true,
      placeholderTextColor: "$textLight500"
    },
    _dark: {
      color: "$textDark50",
      props: {
        placeholderTextColor: "$textDark400"
      }
    },
    _web: {
      "cursor": "text",
      ":disabled": {
        cursor: "not-allowed"
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Toast.ts
  var import_react144 = __require("./mock-20434.js");
  var Toast = (0, import_react144.createStyle)({
    px: "$4",
    py: "$3",
    borderRadius: "$sm",
    flexDirection: "row",
    variants: {
      action: {
        error: {
          bg: "$backgroundLightError",
          borderColor: "$error300",
          _icon: {
            color: "$error500"
          },
          _dark: {
            bg: "$backgroundDarkError",
            borderColor: "$error700",
            _icon: {
              color: "$error500"
            }
          }
        },
        warning: {
          bg: "$backgroundLightWarning",
          borderColor: "$warning300",
          _icon: {
            color: "$warning500"
          },
          _dark: {
            bg: "$backgroundDarkWarning",
            borderColor: "$warning700",
            _icon: {
              color: "$warning500"
            }
          }
        },
        success: {
          bg: "$backgroundLightSuccess",
          borderColor: "$success300",
          _icon: {
            color: "$success500"
          },
          _dark: {
            bg: "$backgroundDarkSuccess",
            borderColor: "$success700",
            _icon: {
              color: "$warning500"
            }
          }
        },
        info: {
          bg: "$backgroundLightInfo",
          borderColor: "$info300",
          _icon: {
            color: "$info500"
          },
          _dark: {
            bg: "$backgroundDarkInfo",
            borderColor: "$info700",
            _icon: {
              color: "$info500"
            }
          }
        },
        attention: {
          bg: "$backgroundLightMuted",
          borderColor: "$secondary300",
          _icon: {
            color: "$secondary600"
          },
          _dark: {
            bg: "$backgroundDarkMuted",
            borderColor: "$secondary700",
            _icon: {
              color: "$secondary400"
            }
          }
        }
      },
      variant: {
        solid: {},
        outline: {
          borderWidth: "$1",
          bg: "$white",
          _dark: {
            bg: "$black"
          }
        },
        accent: {
          borderLeftWidth: "$4"
        }
      }
    },
    m: "$3",
    _web: {
      pointerEvents: "auto"
    },
    defaultProps: {
      hardShadow: "5",
      variant: "solid",
      action: "attention"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ToastDescription.ts
  var import_react145 = __require("./mock-20434.js");
  var ToastDescription = (0, import_react145.createStyle)({
    color: "$textLight700",
    _dark: {
      color: "$textDark200"
    },
    props: {
      size: "sm"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/ToastTitle.ts
  var import_react146 = __require("./mock-20434.js");
  var ToastTitle = (0, import_react146.createStyle)({
    fontWeight: "$medium",
    props: {
      size: "md"
    },
    color: "$textLight900",
    _dark: {
      color: "$textDark50"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/Tooltip.ts
  var import_react147 = __require("./mock-20434.js");
  var Tooltip = (0, import_react147.createStyle)({
    width: "$full",
    height: "$full",
    _web: {
      pointerEvents: "none"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/TooltipContent.ts
  var import_react148 = __require("./mock-20434.js");
  var TooltipContent = (0, import_react148.createStyle)({
    ":initial": {
      opacity: 0,
      scale: 0.5
    },
    ":animate": {
      opacity: 1,
      scale: 1
    },
    ":exit": {
      opacity: 0,
      scale: 0.5
    },
    ":transition": {
      type: "spring",
      damping: 18,
      stiffness: 250,
      opacity: {
        type: "timing",
        duration: 250
      }
    },
    "py": "$1",
    "px": "$3",
    "borderRadius": "$sm",
    "bg": "$backgroundLight900",
    "_text": {
      fontSize: "$xs",
      color: "$textLight50"
    },
    "_web": {
      pointerEvents: "auto"
    },
    // @ts-ignore
    "_dark": {
      bg: "$backgroundDark800",
      _text: {
        color: "$textDark50"
      }
    },
    "defaultProps": {
      hardShadow: "2"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/TooltipText.ts
  var import_react149 = __require("./mock-20434.js");
  var TooltipText = (0, import_react149.createStyle)({
    color: "$red400",
    fontFamily: "$body",
    _web: {
      userSelect: "none"
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/VStack.ts
  var import_react150 = __require("./mock-20434.js");
  var VStack = (0, import_react150.createStyle)({
    flexDirection: "column",
    variants: {
      space: {
        "xs": {
          gap: `$1`
        },
        "sm": {
          gap: `$2`
        },
        "md": {
          gap: `$3`
        },
        "lg": {
          gap: `$4`
        },
        "xl": {
          gap: `$5`
        },
        "2xl": {
          gap: `$6`
        },
        "3xl": {
          gap: `$7`
        },
        "4xl": {
          gap: `$8`
        }
      },
      reversed: {
        true: {
          flexDirection: "column-reverse"
        }
      }
    }
  });

  // node_modules/@gluestack-ui/config/src/theme/View.ts
  var import_react151 = __require("./mock-20434.js");
  var View = (0, import_react151.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/ImageBackground.ts
  var import_react152 = __require("./mock-20434.js");
  var ImageBackground = (0, import_react152.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/InputAccessoryView.ts
  var import_react153 = __require("./mock-20434.js");
  var InputAccessoryView = (0, import_react153.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/SafeAreaView.ts
  var import_react154 = __require("./mock-20434.js");
  var SafeAreaView = (0, import_react154.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/RefreshControl.ts
  var import_react155 = __require("./mock-20434.js");
  var RefreshControl = (0, import_react155.createStyle)({});

  // node_modules/@gluestack-ui/config/src/theme/VirtualizedList.ts
  var import_react156 = __require("./mock-20434.js");
  var VirtualizedList = (0, import_react156.createStyle)({});
  return __toCommonJS(theme_exports);
})();
module.exports = config;
