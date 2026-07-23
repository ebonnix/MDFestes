/* @ds-bundle: {"format":4,"namespace":"AutomatedEstimatingDesignSystem_620df8","components":[{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/display/Badge.jsx":"6fb085e44b3e","components/display/Card.jsx":"4cd190130e5e","components/display/Tag.jsx":"eb4d58dd4d86","components/feedback/Dialog.jsx":"b9b47a05cef6","components/feedback/Toast.jsx":"a5d1725d89ef","components/feedback/Tooltip.jsx":"37e5373f7e62","components/forms/Button.jsx":"ee3865b9e3ef","components/forms/Checkbox.jsx":"78a1ba1c8c43","components/forms/IconButton.jsx":"9606ffd51205","components/forms/Input.jsx":"441126db5d0c","components/forms/Radio.jsx":"3e5f3302a980","components/forms/Select.jsx":"6914b49ea6d4","components/forms/Switch.jsx":"d28fbef12d10","components/navigation/Tabs.jsx":"62c36883a9ab","ui_kits/app/AppShell.jsx":"f35b93067e8b","ui_kits/app/Dashboard.jsx":"9cdc80ea1681","ui_kits/app/EstimateDetail.jsx":"ec3ac2fb9ae9","ui_kits/app/Rates.jsx":"0b34b04e3daa","ui_kits/app/Reps.jsx":"29e58060485e","ui_kits/app/data.jsx":"aa91c38b6865","ui_kits/shared/icons.jsx":"df65712c3021","ui_kits/website/Site.jsx":"b0e1d37ae10d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AutomatedEstimatingDesignSystem_620df8 = window.AutomatedEstimatingDesignSystem_620df8 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/display/Badge.jsx
try { (() => {
const ST = {
  draft: {
    bg: 'var(--gray-200)',
    color: 'var(--gray-700)'
  },
  sent: {
    bg: 'var(--blue-100)',
    color: 'var(--blue-600)'
  },
  won: {
    bg: 'var(--green-100)',
    color: 'var(--green-600)'
  },
  lost: {
    bg: 'var(--red-100)',
    color: 'var(--red-600)'
  },
  warning: {
    bg: 'var(--yellow-100)',
    color: '#7A5C00'
  },
  ink: {
    bg: 'var(--ink-900)',
    color: 'var(--paper-50)'
  },
  accent: {
    bg: 'var(--orange-100)',
    color: 'var(--orange-600)'
  }
};
function Badge({
  status = 'draft',
  children,
  style
}) {
  const s = ST[status] || ST.draft;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height: 22,
      padding: '0 10px',
      borderRadius: 'var(--radius-pill)',
      background: s.bg,
      color: s.color,
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 640,
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  variant = 'app',
  padding = 20,
  children,
  style,
  ...rest
}) {
  const v = variant === 'stamped' ? {
    border: '2px solid var(--ink-900)',
    boxShadow: 'var(--shadow-stamp)',
    background: 'var(--paper-0)'
  } : {
    border: '1px solid var(--border-subtle)',
    boxShadow: 'var(--shadow-card)',
    background: 'var(--surface-card)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      borderRadius: 'var(--radius-md)',
      padding,
      ...v,
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function Tag({
  mono = false,
  onRemove,
  children,
  style
}) {
  const [hov, setHov] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 24,
      padding: '0 4px 0 10px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--paper-200)',
      border: '1px solid var(--border-default)',
      color: 'var(--text-body)',
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
      fontSize: 12,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      ...style
    }
  }, children, onRemove ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Remove",
    onClick: onRemove,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16,
      border: 'none',
      borderRadius: 2,
      background: hov ? 'var(--paper-300)' : 'transparent',
      cursor: 'pointer',
      padding: 0,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "10",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m6 6 12 12"
  }))) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6
    }
  }));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = false,
  onClose,
  title,
  children,
  footer,
  width = 480
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (e.target === e.currentTarget && onClose) onClose();
    },
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(14,27,44,.55)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      width,
      maxWidth: 'calc(100vw - 48px)',
      background: 'var(--paper-0)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-pop)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 24px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 640,
      color: 'var(--text-strong)'
    }
  }, title), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Close",
    onClick: onClose,
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      padding: 6,
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text-secondary)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m6 6 12 12"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      fontSize: 14,
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-body)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      padding: '16px 24px',
      background: 'var(--paper-50)',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const V = {
  success: {
    bar: 'var(--status-success)',
    icon: 'M20 6 9 17l-5-5'
  },
  danger: {
    bar: 'var(--status-danger)',
    icon: 'M18 6 6 18M6 6l12 12'
  },
  info: {
    bar: 'var(--status-info)',
    icon: 'M12 16v-4M12 8h.01'
  },
  warning: {
    bar: 'var(--status-warning)',
    icon: 'M12 9v4M12 17h.01'
  }
};
function Toast({
  variant = 'info',
  title,
  detail,
  onDismiss,
  style
}) {
  const v = V[variant] || V.info;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      width: 360,
      background: 'var(--ink-900)',
      color: 'var(--paper-50)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-pop)',
      padding: '12px 14px',
      fontFamily: 'var(--font-body)',
      borderLeft: '4px solid ' + v.bar,
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: v.bar,
    strokeWidth: "2.5",
    strokeLinecap: "square",
    style: {
      flexShrink: 0,
      marginTop: 1
    }
  }, variant === 'info' || variant === 'warning' ? /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9",
    strokeWidth: "2"
  }) : null, /*#__PURE__*/React.createElement("path", {
    d: v.icon
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 640
    }
  }, title), detail && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--gray-300)',
      marginTop: 2
    }
  }, detail)), onDismiss && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Dismiss",
    onClick: onDismiss,
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      padding: 2,
      color: 'var(--gray-400)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m6 6 12 12"
  }))));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  label,
  side = 'top',
  children
}) {
  const [show, setShow] = React.useState(false);
  const pos = side === 'bottom' ? {
    top: 'calc(100% + 6px)'
  } : {
    bottom: 'calc(100% + 6px)'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false)
  }, children, show && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      ...pos,
      background: 'var(--ink-900)',
      color: 'var(--paper-50)',
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1.4,
      padding: '5px 9px',
      borderRadius: 'var(--radius-sm)',
      whiteSpace: 'nowrap',
      zIndex: 50,
      pointerEvents: 'none'
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SZ = {
  sm: {
    h: 'var(--size-control-sm)',
    f: 13,
    px: '12px'
  },
  md: {
    h: 'var(--size-control-md)',
    f: 14,
    px: '16px'
  },
  lg: {
    h: 'var(--size-control-lg)',
    f: 15,
    px: '20px'
  }
};
const VR = {
  primary: {
    bg: 'var(--action-primary)',
    hover: 'var(--action-primary-hover)',
    color: 'var(--ink-900)',
    border: 'none'
  },
  ink: {
    bg: 'var(--action-ink)',
    hover: 'var(--action-ink-hover)',
    color: 'var(--paper-50)',
    border: 'none'
  },
  outline: {
    bg: 'transparent',
    hover: 'var(--paper-200)',
    color: 'var(--ink-900)',
    border: '1px solid var(--ink-900)'
  },
  ghost: {
    bg: 'transparent',
    hover: 'var(--paper-200)',
    color: 'var(--ink-900)',
    border: 'none'
  },
  danger: {
    bg: 'var(--status-danger)',
    hover: 'var(--red-600)',
    color: '#fff',
    border: 'none'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  stamped = false,
  disabled = false,
  children,
  style,
  ...rest
}) {
  const [hov, setHov] = React.useState(false),
    [act, setAct] = React.useState(false),
    [foc, setFoc] = React.useState(false);
  const s = SZ[size] || SZ.md,
    v = VR[variant] || VR.primary;
  const st = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: s.h,
    padding: '0 ' + s.px,
    fontFamily: 'var(--font-body)',
    fontWeight: 640,
    fontSize: s.f,
    lineHeight: 1,
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    background: hov && !disabled ? v.hover : v.bg,
    color: v.color,
    border: v.border,
    transition: 'background var(--dur-fast) var(--ease-snap),transform var(--dur-fast) var(--ease-snap),box-shadow var(--dur-fast) var(--ease-snap)',
    userSelect: 'none',
    whiteSpace: 'nowrap'
  };
  if (stamped) {
    st.border = '2px solid var(--ink-900)';
    st.boxShadow = act ? '0px 0px 0 var(--ink-900)' : 'var(--shadow-stamp-sm)';
    st.transform = act ? 'translate(3px,3px)' : 'none';
  } else if (act && !disabled) st.transform = 'translateY(1px)';
  if (foc) st.boxShadow = (st.boxShadow ? st.boxShadow + ',' : '') + 'var(--focus-ring)';
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button"
  }, rest, {
    disabled: disabled,
    style: {
      ...st,
      ...style
    },
    onMouseEnter: e => {
      setHov(true);
      rest.onMouseEnter && rest.onMouseEnter(e);
    },
    onMouseLeave: e => {
      setHov(false);
      setAct(false);
      rest.onMouseLeave && rest.onMouseLeave(e);
    },
    onMouseDown: e => {
      setAct(true);
      rest.onMouseDown && rest.onMouseDown(e);
    },
    onMouseUp: e => {
      setAct(false);
      rest.onMouseUp && rest.onMouseUp(e);
    },
    onFocus: e => {
      setFoc(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFoc(false);
      rest.onBlur && rest.onBlur(e);
    }
  }), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  style
}) {
  const [foc, setFoc] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-body)',
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 18,
      height: 18,
      flexShrink: 0,
      borderRadius: 'var(--radius-sm)',
      border: checked ? 'none' : '1.5px solid var(--gray-400)',
      background: checked ? 'var(--ink-900)' : 'var(--paper-0)',
      boxShadow: foc ? 'var(--focus-ring)' : 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background var(--dur-fast) var(--ease-snap)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    onFocus: () => setFoc(true),
    onBlur: () => setFoc(false),
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0,
      margin: 0,
      cursor: 'inherit'
    }
  }), checked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--paper-0)",
    strokeWidth: "3.5",
    strokeLinecap: "square"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }))), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SZ = {
  sm: 'var(--size-control-sm)',
  md: 'var(--size-control-md)',
  lg: 'var(--size-control-lg)'
};
const VR = {
  ink: {
    bg: 'var(--action-ink)',
    hover: 'var(--action-ink-hover)',
    color: 'var(--paper-50)',
    border: 'none'
  },
  outline: {
    bg: 'transparent',
    hover: 'var(--paper-200)',
    color: 'var(--ink-900)',
    border: '1px solid var(--ink-900)'
  },
  ghost: {
    bg: 'transparent',
    hover: 'var(--paper-200)',
    color: 'var(--ink-900)',
    border: 'none'
  }
};
function IconButton({
  variant = 'ghost',
  size = 'md',
  disabled = false,
  children,
  style,
  ...rest
}) {
  const [hov, setHov] = React.useState(false),
    [foc, setFoc] = React.useState(false);
  const v = VR[variant] || VR.ghost,
    d = SZ[size] || SZ.md;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button"
  }, rest, {
    disabled: disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: d,
      height: d,
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      background: hov && !disabled ? v.hover : v.bg,
      color: v.color,
      border: v.border,
      transition: 'background var(--dur-fast) var(--ease-snap)',
      boxShadow: foc ? 'var(--focus-ring)' : 'none',
      ...style
    },
    onMouseEnter: e => {
      setHov(true);
      rest.onMouseEnter && rest.onMouseEnter(e);
    },
    onMouseLeave: e => {
      setHov(false);
      rest.onMouseLeave && rest.onMouseLeave(e);
    },
    onFocus: e => {
      setFoc(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFoc(false);
      rest.onBlur && rest.onBlur(e);
    }
  }), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SZ = {
  sm: {
    h: 'var(--size-control-sm)',
    f: 13
  },
  md: {
    h: 'var(--size-control-md)',
    f: 14
  },
  lg: {
    h: 'var(--size-control-lg)',
    f: 15
  }
};
function Input({
  size = 'md',
  invalid = false,
  mono = false,
  prefix,
  suffix,
  disabled = false,
  style,
  ...rest
}) {
  const [foc, setFoc] = React.useState(false);
  const s = SZ[size] || SZ.md;
  const border = invalid ? '1px solid var(--status-danger)' : foc ? '1px solid var(--border-focus)' : '1px solid var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height: s.h,
      background: disabled ? 'var(--surface-sunken)' : 'var(--paper-0)',
      border,
      borderRadius: 'var(--radius-sm)',
      boxShadow: foc ? 'var(--focus-ring)' : 'none',
      transition: 'box-shadow var(--dur-fast) var(--ease-snap)',
      opacity: disabled ? 0.6 : 1,
      ...style
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      paddingLeft: 10,
      fontFamily: 'var(--font-mono)',
      fontSize: s.f - 1,
      color: 'var(--text-muted)'
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({}, rest, {
    disabled: disabled,
    onFocus: e => {
      setFoc(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFoc(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      flex: 1,
      minWidth: 0,
      height: '100%',
      padding: '0 10px',
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
      fontVariantNumeric: 'tabular-nums',
      fontSize: s.f,
      color: 'var(--text-body)'
    }
  })), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      paddingRight: 10,
      fontFamily: 'var(--font-mono)',
      fontSize: s.f - 1,
      color: 'var(--text-muted)'
    }
  }, suffix));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  checked = false,
  onChange,
  label,
  name,
  value,
  disabled = false,
  style
}) {
  const [foc, setFoc] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-body)',
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 18,
      height: 18,
      flexShrink: 0,
      borderRadius: '50%',
      border: checked ? '6px solid var(--ink-900)' : '1.5px solid var(--gray-400)',
      background: 'var(--paper-0)',
      boxShadow: foc ? 'var(--focus-ring)' : 'none',
      boxSizing: 'border-box',
      transition: 'border var(--dur-fast) var(--ease-snap)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    disabled: disabled,
    onChange: () => onChange && onChange(value),
    onFocus: () => setFoc(true),
    onBlur: () => setFoc(false),
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0,
      margin: 0,
      cursor: 'inherit'
    }
  })), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SZ = {
  sm: {
    h: 'var(--size-control-sm)',
    f: 13
  },
  md: {
    h: 'var(--size-control-md)',
    f: 14
  },
  lg: {
    h: 'var(--size-control-lg)',
    f: 15
  }
};
function Select({
  size = 'md',
  invalid = false,
  disabled = false,
  children,
  style,
  ...rest
}) {
  const [foc, setFoc] = React.useState(false);
  const s = SZ[size] || SZ.md;
  const border = invalid ? '1px solid var(--status-danger)' : foc ? '1px solid var(--border-focus)' : '1px solid var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      position: 'relative',
      height: s.h,
      background: disabled ? 'var(--surface-sunken)' : 'var(--paper-0)',
      border,
      borderRadius: 'var(--radius-sm)',
      boxShadow: foc ? 'var(--focus-ring)' : 'none',
      opacity: disabled ? 0.6 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("select", _extends({}, rest, {
    disabled: disabled,
    onFocus: e => {
      setFoc(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFoc(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      height: '100%',
      padding: '0 32px 0 10px',
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-body)',
      fontSize: s.f,
      color: 'var(--text-body)',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }
  }), children), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    style: {
      position: 'absolute',
      right: 8,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  style
}) {
  const [foc, setFoc] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-body)',
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 38,
      height: 22,
      flexShrink: 0,
      borderRadius: 'var(--radius-pill)',
      background: checked ? 'var(--ink-900)' : 'var(--gray-300)',
      boxShadow: foc ? 'var(--focus-ring)' : 'none',
      transition: 'background var(--dur-med) var(--ease-snap)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    role: "switch",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    onFocus: () => setFoc(true),
    onBlur: () => setFoc(false),
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0,
      margin: 0,
      cursor: 'inherit'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: checked ? 19 : 3,
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: 'var(--paper-0)',
      transition: 'left var(--dur-med) var(--ease-snap)'
    }
  })), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  onChange,
  style
}) {
  const [hov, setHov] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 24,
      borderBottom: '1px solid var(--border-default)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, items.map(it => {
    const act = it.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      role: "tab",
      "aria-selected": act,
      onClick: () => onChange && onChange(it.id),
      onMouseEnter: () => setHov(it.id),
      onMouseLeave: () => setHov(null),
      style: {
        appearance: 'none',
        background: 'none',
        border: 'none',
        padding: '10px 2px 12px',
        marginBottom: -1,
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 14,
        fontWeight: act ? 640 : 500,
        color: act ? 'var(--text-strong)' : hov === it.id ? 'var(--text-body)' : 'var(--text-secondary)',
        borderBottom: act ? '2px solid var(--ink-900)' : '2px solid transparent',
        transition: 'color var(--dur-fast) var(--ease-snap)',
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, it.label, it.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        background: act ? 'var(--ink-900)' : 'var(--paper-200)',
        color: act ? 'var(--paper-50)' : 'var(--text-secondary)',
        borderRadius: 'var(--radius-pill)',
        padding: '1px 7px'
      }
    }, it.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppShell.jsx
try { (() => {
const {
  IconButton,
  Button,
  Input,
  Select
} = window.AutomatedEstimatingDesignSystem_620df8;
function NavItem({
  icon,
  label,
  active,
  onClick
}) {
  const [hov, setHov] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      width: '100%',
      height: 38,
      padding: '0 12px',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'var(--font-body)',
      fontSize: 13.5,
      fontWeight: active ? 640 : 500,
      color: active ? 'var(--paper-50)' : 'var(--gray-400)',
      background: active ? 'var(--ink-700)' : hov ? 'var(--ink-800)' : 'transparent',
      transition: 'background var(--dur-fast) var(--ease-snap)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16
  }), label, active && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      width: 4,
      height: 16,
      background: 'var(--orange-500)',
      borderRadius: 2
    }
  }));
}
function AppShell({
  screen,
  setScreen,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100vh',
      background: 'var(--surface-page)',
      fontFamily: 'var(--font-body)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 216,
      flexShrink: 0,
      background: 'var(--ink-900)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 12px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 12px 22px',
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 900,
      textTransform: 'uppercase',
      fontSize: 15,
      lineHeight: 1.1,
      color: 'var(--paper-50)'
    }
  }, "Automated", /*#__PURE__*/React.createElement("br", null), "Estimating", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--orange-500)'
    }
  }, ".")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(NavItem, {
    icon: "layout-dashboard",
    label: "Dashboard",
    active: screen === 'dashboard',
    onClick: () => setScreen('dashboard')
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "file-text",
    label: "Estimates",
    active: screen === 'detail',
    onClick: () => setScreen('detail')
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "database",
    label: "Regional rates",
    active: screen === 'rates',
    onClick: () => setScreen('rates')
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "users",
    label: "Sales reps",
    active: screen === 'reps',
    onClick: () => setScreen('reps')
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "settings",
    label: "Settings",
    active: false,
    onClick: () => {}
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: 'var(--hazard-stripe)',
      borderRadius: 2,
      margin: '0 12px 14px',
      opacity: .9
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: 'var(--orange-500)',
      color: 'var(--ink-900)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: 12
    }
  }, "JA"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--gray-300)',
      lineHeight: 1.3
    }
  }, "Jess Alvarez", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gray-400)',
      fontSize: 11
    }
  }, "Senior Estimator"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      height: 60,
      padding: '0 24px',
      background: 'var(--paper-0)',
      borderBottom: '1px solid var(--border-default)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 300
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--text-muted)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15
  })), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search estimates, clients, reps\u2026",
    style: {
      width: '100%',
      height: 36,
      padding: '0 10px 0 32px',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--paper-50)',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-body)',
      outline: 'none',
      boxSizing: 'border-box'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 36,
      padding: '0 12px',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-sm)',
      fontSize: 12.5,
      fontWeight: 500,
      color: 'var(--text-body)',
      background: 'var(--paper-0)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 14,
    style: {
      color: 'var(--blue-500)'
    }
  }), "Denver-Aurora-Lakewood", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, "CO-DEN"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 13,
    style: {
      color: 'var(--text-muted)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "Notifications"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 17
  })), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setScreen('detail')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 15
  }), "New estimate"))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children)));
}
Object.assign(window, {
  AppShell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Dashboard.jsx
try { (() => {
const {
  Card,
  Badge,
  Tabs,
  Tag,
  Button,
  IconButton
} = window.AutomatedEstimatingDesignSystem_620df8;
function Kpi({
  label,
  value,
  sub,
  up,
  down
}) {
  return /*#__PURE__*/React.createElement(Card, {
    padding: 18,
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: AE_UI.lb
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      ...AE_UI.mono,
      fontSize: 26,
      fontWeight: 600,
      color: 'var(--text-strong)',
      marginTop: 8
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      marginTop: 6,
      fontSize: 12,
      color: up ? 'var(--green-600)' : down ? 'var(--red-600)' : 'var(--text-secondary)'
    }
  }, (up || down) && /*#__PURE__*/React.createElement(Icon, {
    name: up ? 'arrow-up-right' : 'arrow-down-right',
    size: 13
  }), /*#__PURE__*/React.createElement("span", {
    style: AE_UI.mono
  }, sub)));
}
function Dashboard({
  openEstimate
}) {
  const [tab, setTab] = React.useState('all');
  const [hovRow, setHovRow] = React.useState(null);
  const rows = AE_DATA.estimates.filter(e => tab === 'all' || tab === 'sent' && e.status === 'sent' || tab === 'won' && e.status === 'won' || tab === 'lost' && e.status === 'lost' || tab === 'draft' && (e.status === 'draft' || e.status === 'warning'));
  const counts = s => AE_DATA.estimates.filter(e => s === 'draft' ? e.status === 'draft' || e.status === 'warning' : e.status === s).length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '26px 28px',
      maxWidth: 1200
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 22,
      fontWeight: 800,
      color: 'var(--text-strong)',
      letterSpacing: '-0.01em'
    }
  }, "Dashboard"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      marginTop: 4
    }
  }, "Rates current as of ", /*#__PURE__*/React.createElement("span", {
    style: {
      ...AE_UI.mono,
      fontSize: 12
    }
  }, AE_DATA.region.vintage), " \xB7 ", AE_DATA.region.metro)), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 14
  }), "Export")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Kpi, {
    label: "Open pipeline",
    value: "$1.99M",
    sub: "+8.2% this month",
    up: true
  }), /*#__PURE__*/React.createElement(Kpi, {
    label: "Win rate",
    value: "54%",
    sub: "+3 pts vs Q1",
    up: true
  }), /*#__PURE__*/React.createElement(Kpi, {
    label: "Open bids",
    value: "29",
    sub: "6 awaiting client"
  }), /*#__PURE__*/React.createElement(Kpi, {
    label: "Avg margin",
    value: "13.6%",
    sub: "-0.8 pts vs region",
    down: true
  })), /*#__PURE__*/React.createElement(Tabs, {
    items: [{
      id: 'all',
      label: 'All bids',
      count: AE_DATA.estimates.length
    }, {
      id: 'draft',
      label: 'Drafts',
      count: counts('draft')
    }, {
      id: 'sent',
      label: 'Sent',
      count: counts('sent')
    }, {
      id: 'won',
      label: 'Won',
      count: counts('won')
    }, {
      id: 'lost',
      label: 'Lost',
      count: counts('lost')
    }],
    value: tab,
    onChange: setTab,
    style: {
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: AE_UI.th
  }, "Estimate"), /*#__PURE__*/React.createElement("th", {
    style: AE_UI.th
  }, "Client"), /*#__PURE__*/React.createElement("th", {
    style: AE_UI.th
  }, "Region"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...AE_UI.th,
      textAlign: 'right'
    }
  }, "Amount"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...AE_UI.th,
      textAlign: 'right'
    }
  }, "Margin"), /*#__PURE__*/React.createElement("th", {
    style: AE_UI.th
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    style: AE_UI.th
  }, "Rep"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...AE_UI.th,
      textAlign: 'right'
    }
  }, "Updated"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(e => /*#__PURE__*/React.createElement("tr", {
    key: e.id,
    onClick: openEstimate,
    onMouseEnter: () => setHovRow(e.id),
    onMouseLeave: () => setHovRow(null),
    style: {
      cursor: 'pointer',
      background: hovRow === e.id ? 'var(--paper-50)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: AE_UI.td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500,
      color: 'var(--text-strong)'
    }
  }, e.name), /*#__PURE__*/React.createElement("div", {
    style: {
      ...AE_UI.mono,
      fontSize: 11,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, e.id)), /*#__PURE__*/React.createElement("td", {
    style: AE_UI.td
  }, e.client), /*#__PURE__*/React.createElement("td", {
    style: AE_UI.td
  }, /*#__PURE__*/React.createElement(Tag, {
    mono: true
  }, e.region)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      ...AE_UI.mono,
      textAlign: 'right',
      fontWeight: 500,
      color: 'var(--text-strong)'
    }
  }, fmt$(e.amount)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      ...AE_UI.mono,
      textAlign: 'right',
      color: e.margin < 10 ? 'var(--red-600)' : 'var(--text-body)'
    }
  }, e.margin.toFixed(1), "%"), /*#__PURE__*/React.createElement("td", {
    style: AE_UI.td
  }, /*#__PURE__*/React.createElement(Badge, {
    status: e.status
  }, e.statusLabel)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, e.rep), /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      textAlign: 'right',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, e.updated)))))));
}
Object.assign(window, {
  Dashboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/EstimateDetail.jsx
try { (() => {
const {
  Card,
  Badge,
  Tag,
  Button,
  IconButton,
  Dialog,
  Tooltip
} = window.AutomatedEstimatingDesignSystem_620df8;
function Stat({
  label,
  value,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '14px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: AE_UI.lb
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      ...AE_UI.mono,
      fontSize: 21,
      fontWeight: 600,
      color: accent || 'var(--text-strong)',
      marginTop: 6
    }
  }, value));
}
function EstimateDetail({
  goBack,
  notify
}) {
  const [dlg, setDlg] = React.useState(false);
  const its = AE_DATA.lineItems;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 28px',
      maxWidth: 1200
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: goBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      padding: 0,
      fontFamily: 'var(--font-body)',
      fontSize: 12.5,
      fontWeight: 500,
      color: 'var(--text-data)',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 14
  }), "All estimates"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 22,
      fontWeight: 800,
      color: 'var(--text-strong)',
      letterSpacing: '-0.01em'
    }
  }, "Riverside Duplex \u2014 Full Frame"), /*#__PURE__*/React.createElement(Badge, {
    status: "warning"
  }, "Needs pricing")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      marginTop: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...AE_UI.mono,
      fontSize: 12
    }
  }, "EST-2101"), "\xB7", /*#__PURE__*/React.createElement("span", null, "Halcyon Homes"), "\xB7", /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 13,
    style: {
      color: 'var(--blue-500)'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Denver-Aurora-Lakewood"), "\xB7", /*#__PURE__*/React.createElement("span", null, "Rep: J. Alvarez"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Tooltip, {
    label: "Duplicate estimate"
  }, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "Duplicate",
    variant: "outline"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "copy",
    size: 16
  }))), /*#__PURE__*/React.createElement(Tooltip, {
    label: "Download PDF"
  }, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "Download",
    variant: "outline"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }))), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setDlg(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "send",
    size: 15
  }), "Send estimate"))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--yellow-500)',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: 'var(--hazard-stripe)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      background: 'var(--yellow-100)',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "circle-alert",
    size: 16,
    style: {
      color: 'var(--ink-900)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 640,
      color: 'var(--ink-900)'
    }
  }, "3 line items are missing regional pricing."), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-700)'
    }
  }, "Pull current rates to finish this bid."), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ink",
    style: {
      marginLeft: 'auto'
    },
    onClick: () => notify({
      variant: 'success',
      title: 'Rates applied',
      detail: 'Framing, Electrical, Drywall priced from BLS Q2 2026.'
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh-cw",
    size: 13
  }), "Pull BLS rates"))), /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      display: 'flex',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Total estimate",
    value: "$148,210"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Direct cost",
    value: "$126,480"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Margin",
    value: "12.4%",
    accent: "var(--green-600)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Cost / sq ft",
    value: "$38.01"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Regional index",
    value: "1.08\xD7",
    accent: "var(--blue-600)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,2.2fr) minmax(260px,1fr)',
      gap: 18,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 640,
      color: 'var(--text-strong)'
    }
  }, "Line items"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 13
  }), "Add item")), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: AE_UI.th
  }, "Item"), /*#__PURE__*/React.createElement("th", {
    style: AE_UI.th
  }, "Trade"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...AE_UI.th,
      textAlign: 'right'
    }
  }, "Qty"), /*#__PURE__*/React.createElement("th", {
    style: AE_UI.th
  }, "Unit"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...AE_UI.th,
      textAlign: 'right'
    }
  }, "Unit cost"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...AE_UI.th,
      textAlign: 'right'
    }
  }, "Total"))), /*#__PURE__*/React.createElement("tbody", null, its.map((it, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      background: it.src === 'missing' ? 'var(--yellow-100)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      fontWeight: 500,
      color: 'var(--text-strong)'
    }
  }, it.item), /*#__PURE__*/React.createElement("td", {
    style: AE_UI.td
  }, /*#__PURE__*/React.createElement(Tag, null, it.trade)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      ...AE_UI.mono,
      textAlign: 'right'
    }
  }, it.qty), /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      fontSize: 12,
      color: 'var(--text-secondary)'
    }
  }, it.unit), /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      ...AE_UI.mono,
      textAlign: 'right'
    }
  }, it.unitCost ? '$' + it.unitCost : /*#__PURE__*/React.createElement(Badge, {
    status: "warning"
  }, "Missing")), /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      ...AE_UI.mono,
      textAlign: 'right',
      fontWeight: 500,
      color: 'var(--text-strong)'
    }
  }, it.total ? fmt$(it.total) : '—')))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 4,
    style: {
      padding: '14px 16px',
      fontSize: 13,
      fontWeight: 640,
      color: 'var(--text-strong)',
      borderTop: '2px solid var(--ink-900)'
    }
  }, "Total (priced items)"), /*#__PURE__*/React.createElement("td", {
    colSpan: 2,
    style: {
      ...AE_UI.mono,
      padding: '14px 16px',
      textAlign: 'right',
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--text-strong)',
      borderTop: '2px solid var(--ink-900)'
    }
  }, "$63,393"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 18
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "database",
    size: 16,
    style: {
      color: 'var(--blue-500)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 640,
      color: 'var(--text-strong)'
    }
  }, "Pricing source")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Data vintage"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...AE_UI.mono,
      color: 'var(--text-body)'
    }
  }, "BLS Q2 2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Metro"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...AE_UI.mono,
      color: 'var(--text-body)'
    }
  }, "CO-DEN")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Wage index"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...AE_UI.mono,
      color: 'var(--text-body)'
    }
  }, "1.08\xD7 national")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Last sync"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...AE_UI.mono,
      color: 'var(--text-body)'
    }
  }, "Jul 14, 2026"))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    style: {
      marginTop: 14,
      width: '100%'
    },
    onClick: () => notify({
      variant: 'info',
      title: 'Rates up to date',
      detail: 'CO-DEN already on BLS Q2 2026.'
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh-cw",
    size: 13
  }), "Sync rates")), /*#__PURE__*/React.createElement(Card, {
    padding: 18
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "building-2",
    size: 16,
    style: {
      color: 'var(--text-secondary)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 640,
      color: 'var(--text-strong)'
    }
  }, "Client")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 500,
      color: 'var(--text-strong)'
    }
  }, "Halcyon Homes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      marginTop: 8,
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 13
  }), "bids@halcyonhomes.co"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone",
    size: 13
  }), /*#__PURE__*/React.createElement("span", {
    style: AE_UI.mono
  }, "(303) 555-0164")))), /*#__PURE__*/React.createElement(Card, {
    padding: 18
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: 'var(--orange-500)',
      color: 'var(--ink-900)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: 13
    }
  }, "JA"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 640,
      color: 'var(--text-strong)'
    }
  }, "Jess Alvarez"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-secondary)'
    }
  }, "Assigned rep \xB7 Denver Metro")), /*#__PURE__*/React.createElement(Badge, {
    status: "ink",
    style: {
      marginLeft: 'auto'
    }
  }, "92% quota"))))), /*#__PURE__*/React.createElement(Dialog, {
    open: dlg,
    onClose: () => setDlg(false),
    title: "Send estimate to Halcyon Homes?",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setDlg(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        setDlg(false);
        notify({
          variant: 'success',
          title: 'Estimate sent',
          detail: 'Halcyon Homes gets a live link + PDF.'
        });
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "send",
      size: 14
    }), "Send it"))
  }, "The client gets a live link with your line items, terms, and an accept button. 3 items are still missing pricing \u2014 they'll show as \"TBD\"."));
}
Object.assign(window, {
  EstimateDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/EstimateDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Rates.jsx
try { (() => {
const {
  Card,
  Button,
  Tag,
  Badge
} = window.AutomatedEstimatingDesignSystem_620df8;
function Rates({
  notify
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '26px 28px',
      maxWidth: 1100
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 22,
      fontWeight: 800,
      color: 'var(--text-strong)',
      letterSpacing: '-0.01em'
    }
  }, "Regional rates"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      marginTop: 4
    }
  }, AE_DATA.region.metro, " \xB7 prevailing wages, ", /*#__PURE__*/React.createElement("span", {
    style: {
      ...AE_UI.mono,
      fontSize: 12
    }
  }, AE_DATA.region.vintage))), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: () => notify({
      variant: 'info',
      title: 'Rates up to date',
      detail: 'CO-DEN already on BLS Q2 2026.'
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh-cw",
    size: 14
  }), "Sync from BLS")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 18,
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: AE_UI.lb
  }, "Wage index vs national"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...AE_UI.mono,
      fontSize: 26,
      fontWeight: 600,
      color: 'var(--blue-600)',
      marginTop: 8
    }
  }, "1.08\xD7"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-secondary)',
      marginTop: 6
    }
  }, "Denver runs 8% hot")), /*#__PURE__*/React.createElement(Card, {
    padding: 18,
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: AE_UI.lb
  }, "Material index"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...AE_UI.mono,
      fontSize: 26,
      fontWeight: 600,
      color: 'var(--text-strong)',
      marginTop: 8
    }
  }, "1.03\xD7"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-secondary)',
      marginTop: 6
    }
  }, "PPI-adjusted, Jul 2026")), /*#__PURE__*/React.createElement(Card, {
    padding: 18,
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: AE_UI.lb
  }, "Tracked trades"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...AE_UI.mono,
      fontSize: 26,
      fontWeight: 600,
      color: 'var(--text-strong)',
      marginTop: 8
    }
  }, "38"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-secondary)',
      marginTop: 6
    }
  }, "SOC-coded from BLS OEWS")), /*#__PURE__*/React.createElement(Card, {
    padding: 18,
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: AE_UI.lb
  }, "Next data drop"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...AE_UI.mono,
      fontSize: 26,
      fontWeight: 600,
      color: 'var(--text-strong)',
      marginTop: 8
    }
  }, "Oct 2"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-secondary)',
      marginTop: 6
    }
  }, "Q3 2026 release"))), /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: AE_UI.th
  }, "Trade"), /*#__PURE__*/React.createElement("th", {
    style: AE_UI.th
  }, "SOC code"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...AE_UI.th,
      textAlign: 'right'
    }
  }, "Loaded rate /hr"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...AE_UI.th,
      textAlign: 'right'
    }
  }, "YoY"), /*#__PURE__*/React.createElement("th", {
    style: AE_UI.th
  }, "Source"))), /*#__PURE__*/React.createElement("tbody", null, AE_DATA.rates.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      fontWeight: 500,
      color: 'var(--text-strong)'
    }
  }, r.trade), /*#__PURE__*/React.createElement("td", {
    style: AE_UI.td
  }, /*#__PURE__*/React.createElement(Tag, {
    mono: true
  }, r.soc)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      ...AE_UI.mono,
      textAlign: 'right',
      fontWeight: 500,
      color: 'var(--text-strong)'
    }
  }, "$", r.rate.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      ...AE_UI.mono,
      textAlign: 'right',
      color: r.delta < 0 ? 'var(--red-600)' : 'var(--green-600)'
    }
  }, r.delta > 0 ? '+' : '', r.delta.toFixed(1), "%"), /*#__PURE__*/React.createElement("td", {
    style: AE_UI.td
  }, /*#__PURE__*/React.createElement(Badge, {
    status: "sent"
  }, "BLS OEWS"))))))));
}
Object.assign(window, {
  Rates
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Rates.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Reps.jsx
try { (() => {
const {
  Card,
  Badge,
  Button
} = window.AutomatedEstimatingDesignSystem_620df8;
function QuotaBar({
  pct
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 8,
      background: 'var(--paper-200)',
      borderRadius: 2,
      overflow: 'hidden',
      minWidth: 70
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      background: pct >= 90 ? 'var(--orange-500)' : 'var(--ink-900)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      ...AE_UI.mono,
      fontSize: 12,
      color: 'var(--text-body)',
      width: 34,
      textAlign: 'right'
    }
  }, pct, "%"));
}
function Reps({
  notify
}) {
  const top = AE_DATA.reps[0];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '26px 28px',
      maxWidth: 1100
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 22,
      fontWeight: 800,
      color: 'var(--text-strong)',
      letterSpacing: '-0.01em'
    }
  }, "Sales reps"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      marginTop: 4
    }
  }, "Q3 2026 \xB7 quota period ends ", /*#__PURE__*/React.createElement("span", {
    style: {
      ...AE_UI.mono,
      fontSize: 12
    }
  }, "Sep 30"))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => notify({
      variant: 'info',
      title: 'Invite sent',
      detail: 'New rep onboarding link emailed.'
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14
  }), "Add rep")), /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      display: 'flex',
      alignItems: 'stretch',
      marginBottom: 22,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 6,
      background: 'var(--hazard-stripe)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '16px 20px',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "award",
    size: 22,
    style: {
      color: 'var(--orange-500)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: '50%',
      background: 'var(--orange-500)',
      color: 'var(--ink-900)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: 14
    }
  }, top.initials), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 640,
      color: 'var(--text-strong)'
    }
  }, top.name, " leads the quarter"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, top.territory, " \xB7 ", top.won, " bids won \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: AE_UI.mono
  }, fmt$(top.pipeline)), " pipeline")), /*#__PURE__*/React.createElement(Badge, {
    status: "accent",
    style: {
      marginLeft: 'auto'
    }
  }, "Top rep"))), /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: AE_UI.th
  }, "Rep"), /*#__PURE__*/React.createElement("th", {
    style: AE_UI.th
  }, "Territory"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...AE_UI.th,
      textAlign: 'right'
    }
  }, "Open"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...AE_UI.th,
      textAlign: 'right'
    }
  }, "Won"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...AE_UI.th,
      textAlign: 'right'
    }
  }, "Close rate"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...AE_UI.th,
      textAlign: 'right'
    }
  }, "Pipeline"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...AE_UI.th,
      width: 170
    }
  }, "Quota"))), /*#__PURE__*/React.createElement("tbody", null, AE_DATA.reps.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    style: AE_UI.td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: i === 0 ? 'var(--orange-500)' : 'var(--ink-900)',
      color: i === 0 ? 'var(--ink-900)' : 'var(--paper-50)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: 11
    }
  }, r.initials), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: 'var(--text-strong)'
    }
  }, r.name))), /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, r.territory), /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      ...AE_UI.mono,
      textAlign: 'right'
    }
  }, r.open), /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      ...AE_UI.mono,
      textAlign: 'right'
    }
  }, r.won), /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      ...AE_UI.mono,
      textAlign: 'right'
    }
  }, r.rate, "%"), /*#__PURE__*/React.createElement("td", {
    style: {
      ...AE_UI.td,
      ...AE_UI.mono,
      textAlign: 'right',
      fontWeight: 500,
      color: 'var(--text-strong)'
    }
  }, fmt$(r.pipeline)), /*#__PURE__*/React.createElement("td", {
    style: AE_UI.td
  }, /*#__PURE__*/React.createElement(QuotaBar, {
    pct: r.quota
  }))))))));
}
Object.assign(window, {
  Reps
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Reps.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.jsx
try { (() => {
const AE_DATA = {
  region: {
    code: 'CO-DEN',
    metro: 'Denver-Aurora-Lakewood, CO',
    vintage: 'BLS Q2 2026',
    updated: 'Jul 14, 2026'
  },
  estimates: [{
    id: 'EST-2101',
    name: 'Riverside Duplex — Full Frame',
    client: 'Halcyon Homes',
    region: 'CO-DEN',
    amount: 148210,
    margin: 12.4,
    status: 'warning',
    statusLabel: 'Needs pricing',
    rep: 'J. Alvarez',
    updated: '2h ago'
  }, {
    id: 'EST-2098',
    name: 'Larimer St Office TI',
    client: 'Peakline Commercial',
    region: 'CO-DEN',
    amount: 86400,
    margin: 15.1,
    status: 'sent',
    statusLabel: 'Sent',
    rep: 'M. Okafor',
    updated: 'Yesterday'
  }, {
    id: 'EST-2094',
    name: 'Golden Ridge Deck & Pergola',
    client: 'T. Whitfield',
    region: 'CO-DEN',
    amount: 23750,
    margin: 18.9,
    status: 'won',
    statusLabel: 'Won',
    rep: 'J. Alvarez',
    updated: '2d ago'
  }, {
    id: 'EST-2090',
    name: 'Aurora Retail Buildout',
    client: 'Corner Market LLC',
    region: 'CO-DEN',
    amount: 212380,
    margin: 9.8,
    status: 'sent',
    statusLabel: 'Sent',
    rep: 'S. Brandt',
    updated: '3d ago'
  }, {
    id: 'EST-2085',
    name: 'Wash Park Kitchen Remodel',
    client: 'The Muellers',
    client2: '',
    region: 'CO-DEN',
    amount: 64900,
    margin: 16.2,
    status: 'draft',
    statusLabel: 'Draft',
    rep: 'M. Okafor',
    updated: '4d ago'
  }, {
    id: 'EST-2079',
    name: 'Boulder Cafe Patio Enclosure',
    client: 'Wildflower Cafe',
    region: 'CO-BOU',
    amount: 41200,
    margin: 11.0,
    status: 'lost',
    statusLabel: 'Lost',
    rep: 'S. Brandt',
    updated: '1w ago'
  }],
  lineItems: [{
    item: 'Foundation & flatwork',
    trade: 'Concrete',
    qty: '1,240',
    unit: 'sq ft',
    unitCost: '8.42',
    total: 10441,
    src: 'bls'
  }, {
    item: 'Framing labor + lumber pkg',
    trade: 'Framing',
    qty: '3,900',
    unit: 'sq ft',
    unitCost: null,
    total: null,
    src: 'missing'
  }, {
    item: 'Roofing — arch. shingle',
    trade: 'Roofing',
    qty: '42',
    unit: 'sq',
    unitCost: '412.00',
    total: 17304,
    src: 'bls'
  }, {
    item: 'Electrical rough + trim',
    trade: 'Electrical',
    qty: '1',
    unit: 'ls',
    unitCost: null,
    total: null,
    src: 'missing'
  }, {
    item: 'Drywall hang/tape/texture',
    trade: 'Drywall',
    qty: '11,800',
    unit: 'sq ft',
    unitCost: null,
    total: null,
    src: 'missing'
  }, {
    item: 'HVAC — 2 systems',
    trade: 'Mechanical',
    qty: '2',
    unit: 'ea',
    unitCost: '6,850.00',
    total: 13700,
    src: 'bls'
  }, {
    item: 'Interior paint',
    trade: 'Paint',
    qty: '11,800',
    unit: 'sq ft',
    unitCost: '1.86',
    total: 21948,
    src: 'bls'
  }],
  reps: [{
    name: 'Jess Alvarez',
    initials: 'JA',
    territory: 'Denver Metro',
    open: 9,
    won: 14,
    rate: 61,
    pipeline: 684200,
    quota: 92
  }, {
    name: 'Marcus Okafor',
    initials: 'MO',
    territory: 'Front Range North',
    open: 7,
    won: 11,
    rate: 55,
    pipeline: 512800,
    quota: 78
  }, {
    name: 'Sara Brandt',
    initials: 'SB',
    territory: 'Mountain West',
    open: 8,
    won: 8,
    rate: 47,
    pipeline: 498100,
    quota: 71
  }, {
    name: 'Dev Patel',
    initials: 'DP',
    territory: 'Colorado Springs',
    open: 5,
    won: 6,
    rate: 43,
    pipeline: 301500,
    quota: 54
  }],
  rates: [{
    trade: 'Carpenters (rough)',
    soc: '47-2031',
    rate: 31.84,
    delta: 2.1
  }, {
    trade: 'Electricians',
    soc: '47-2111',
    rate: 38.62,
    delta: 1.4
  }, {
    trade: 'Plumbers & pipefitters',
    soc: '47-2152',
    rate: 37.15,
    delta: 0.9
  }, {
    trade: 'Drywall installers',
    soc: '47-2081',
    rate: 28.40,
    delta: 3.2
  }, {
    trade: 'Painters (construction)',
    soc: '47-2141',
    rate: 24.96,
    delta: -0.4
  }, {
    trade: 'Roofers',
    soc: '47-2181',
    rate: 27.33,
    delta: 1.8
  }, {
    trade: 'HVAC mechanics',
    soc: '49-9021',
    rate: 34.71,
    delta: 1.1
  }, {
    trade: 'Construction laborers',
    soc: '47-2061',
    rate: 22.05,
    delta: 2.6
  }]
};
const fmt$ = n => '$' + n.toLocaleString('en-US');
const AE_UI = {
  lb: {
    fontSize: 10,
    fontWeight: 640,
    letterSpacing: 'var(--tracking-label)',
    textTransform: 'uppercase',
    color: 'var(--text-muted)'
  },
  mono: {
    fontFamily: 'var(--font-mono)',
    fontVariantNumeric: 'tabular-nums'
  },
  th: {
    textAlign: 'left',
    padding: '10px 16px',
    fontSize: 10,
    fontWeight: 640,
    letterSpacing: 'var(--tracking-label)',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    borderBottom: '2px solid var(--ink-900)'
  },
  td: {
    padding: '12px 16px',
    fontSize: 13,
    borderBottom: '1px solid var(--border-subtle)',
    color: 'var(--text-body)'
  }
};
Object.assign(window, {
  AE_DATA,
  AE_UI,
  fmt$
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shared/icons.jsx
try { (() => {
function Icon({
  name,
  size = 16,
  style
}) {
  const url = 'url("' + (window.__ICON_BASE || '../../assets/icons/') + name + '.svg")';
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-block',
      width: size,
      height: size,
      flexShrink: 0,
      background: 'currentColor',
      WebkitMaskImage: url,
      maskImage: url,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      ...style
    }
  });
}
Object.assign(window, {
  Icon
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shared/icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Site.jsx
try { (() => {
const {
  Button,
  Card,
  Badge,
  Tag
} = window.AutomatedEstimatingDesignSystem_620df8;
const dsp = (s, extra) => ({
  fontFamily: 'var(--font-display)',
  fontStretch: '125%',
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: 'var(--tracking-display)',
  lineHeight: 'var(--leading-tight)',
  fontSize: s,
  ...extra
});
const mono = {
  fontFamily: 'var(--font-mono)',
  fontVariantNumeric: 'tabular-nums'
};
function Wrap({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-marketing)',
      margin: '0 auto',
      padding: '0 32px',
      ...style
    }
  }, children);
}
function SiteNav() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ink-900)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement(Wrap, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28,
      height: 64
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: dsp(15, {
      color: 'var(--paper-50)'
    })
  }, "Automated Estimating", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--orange-500)'
    }
  }, ".")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 22,
      marginLeft: 'auto'
    }
  }, ['Product', 'Data', 'Pricing', 'For reps'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      color: 'var(--gray-300)',
      textDecoration: 'none',
      fontSize: 13.5,
      fontWeight: 500
    }
  }, l))), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--paper-50)',
      textDecoration: 'none',
      fontSize: 13.5,
      fontWeight: 640
    }
  }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
    size: "sm"
  }, "Start free")));
}
function Hero() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper-100) var(--blueprint-grid)',
      backgroundSize: 'var(--blueprint-grid-size)',
      borderBottom: '2px solid var(--ink-900)'
    }
  }, /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '88px 32px 72px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--paper-0)',
      border: '1.5px solid var(--ink-900)',
      borderRadius: 'var(--radius-pill)',
      padding: '6px 14px',
      fontSize: 12,
      fontWeight: 640,
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--ink-900)',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "database",
    size: 13,
    style: {
      color: 'var(--blue-500)'
    }
  }), "Backed by BLS Q2 2026 data"), /*#__PURE__*/React.createElement("h1", {
    style: {
      ...dsp('clamp(44px,7vw,84px)'),
      margin: '0 0 20px',
      color: 'var(--ink-900)'
    }
  }, "Bid it like", /*#__PURE__*/React.createElement("br", null), "you ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--orange-500)'
    }
  }, "mean it.")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 auto 32px',
      maxWidth: 520,
      fontSize: 17,
      lineHeight: 'var(--leading-body)',
      color: 'var(--gray-700)'
    }
  }, "Construction estimates built on real BLS labor data and regional pricing \u2014 with a sales-rep system that turns bids into wins."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      justifyContent: 'center',
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    stamped: true
  }, "Start estimating free"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "outline",
    stamped: true,
    style: {
      background: 'var(--paper-0)'
    }
  }, "Watch 2-min demo")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      border: '2px solid var(--ink-900)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--paper-0)',
      boxShadow: 'var(--shadow-stamp)',
      overflow: 'hidden'
    }
  }, [['38', 'trades tracked'], ['387', 'US metros priced'], ['12 min', 'avg time to bid'], ['+31%', 'win rate lift']].map(([v, l], i) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      padding: '18px 30px',
      borderLeft: i ? '1px solid var(--paper-300)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...mono,
      fontSize: 26,
      fontWeight: 600,
      color: 'var(--ink-900)'
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 640,
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--gray-500)',
      marginTop: 4
    }
  }, l))))));
}
function Features() {
  const F = [['calculator', 'Estimates that build themselves', 'Pick the trades, enter quantities — we price every line from current BLS rates for your metro. No more guessing at labor.'], ['map-pin', 'Priced for your region', 'Denver isn\u2019t Dallas. Every rate carries a regional wage index, so your number is right where the job breaks ground.'], ['target', 'A sales system built in', 'Assign reps, track quotas, send live estimate links, and see the moment a client opens your bid.']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper-50)',
      padding: '80px 0'
    }
  }, /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 640,
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--orange-600)',
      marginBottom: 12
    }
  }, "Why crews switch"), /*#__PURE__*/React.createElement("h2", {
    style: {
      ...dsp(38),
      margin: '0 0 40px',
      color: 'var(--ink-900)'
    }
  }, "Stop guessing. Start winning."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 24
    }
  }, F.map(([ic, t, d]) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    variant: "stamped",
    padding: 28
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--ink-900)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--orange-500)',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: 'var(--ink-900)',
      letterSpacing: '-0.01em',
      marginBottom: 8
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: 'var(--leading-body)',
      color: 'var(--gray-700)'
    }
  }, d))))));
}
function DataBand() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ink-900)',
      color: 'var(--paper-50)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: 'var(--hazard-stripe)'
    }
  }), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '80px 32px',
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 640,
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--yellow-500)',
      marginBottom: 12
    }
  }, "The data under the hood"), /*#__PURE__*/React.createElement("h2", {
    style: {
      ...dsp(36),
      margin: '0 0 18px',
      color: 'var(--paper-50)'
    }
  }, "Numbers you can", /*#__PURE__*/React.createElement("br", null), "defend at the table."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 26px',
      fontSize: 15,
      lineHeight: 'var(--leading-body)',
      color: 'var(--gray-300)',
      maxWidth: 440
    }
  }, "Every unit cost traces back to Bureau of Labor Statistics wage data, SOC-coded by trade and indexed to your metro. When a client asks where your number came from, you have an answer."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "See the data")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ink-800)',
      border: '1px solid var(--ink-700)',
      borderRadius: 'var(--radius-md)',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 640,
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--gray-400)'
    }
  }, "Carpenters \xB7 Denver-Aurora"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...mono,
      fontSize: 11,
      color: 'var(--gray-400)'
    }
  }, "BLS OEWS 47-2031")), /*#__PURE__*/React.createElement("div", {
    style: {
      ...mono,
      fontSize: 56,
      fontWeight: 600,
      color: 'var(--paper-50)',
      lineHeight: 1
    }
  }, "$31.84", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      color: 'var(--gray-400)'
    }
  }, "/hr")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...mono,
      fontSize: 12,
      color: 'var(--green-500)'
    }
  }, "\u25B2 +2.1% YoY"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...mono,
      fontSize: 12,
      color: 'var(--gray-400)'
    }
  }, "index 1.08\xD7 national")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--ink-700)',
      margin: '18px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, [['Electricians', '$38.62', 72], ['Plumbers', '$37.15', 68], ['Drywall', '$28.40', 49]].map(([t, v, w]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--gray-300)',
      width: 86
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 8,
      background: 'var(--ink-700)',
      borderRadius: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: w + '%',
      height: '100%',
      background: 'var(--orange-500)',
      borderRadius: 2
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      ...mono,
      fontSize: 12.5,
      color: 'var(--paper-50)'
    }
  }, v)))))));
}
function Pricing() {
  const tiers = [{
    name: 'Solo',
    price: '$49',
    per: '/mo',
    desc: 'One estimator, unlimited bids',
    feats: ['BLS pricing for 1 metro', 'Unlimited estimates', 'PDF + live-link sending'],
    cta: 'Start free',
    v: 'outline'
  }, {
    name: 'Crew',
    price: '$149',
    per: '/mo',
    desc: 'For teams that bid every day',
    feats: ['Every US metro', 'Sales reps + quotas', 'Client open tracking', 'Rate auto-sync'],
    cta: 'Start free',
    v: 'primary',
    hot: true
  }, {
    name: 'Fleet',
    price: 'Custom',
    per: '',
    desc: 'Multi-office operations',
    feats: ['SSO + roles', 'API access', 'Dedicated onboarding'],
    cta: 'Talk to sales',
    v: 'ink'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper-100)',
      padding: '80px 0'
    }
  }, /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      ...dsp(38),
      margin: '0 0 8px',
      color: 'var(--ink-900)',
      textAlign: 'center'
    }
  }, "Pick your crew size"), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      margin: '0 0 44px',
      fontSize: 15,
      color: 'var(--gray-500)'
    }
  }, "14-day free trial. No card. Cancel whenever."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 24,
      alignItems: 'stretch'
    }
  }, tiers.map(t => /*#__PURE__*/React.createElement(Card, {
    key: t.name,
    variant: "stamped",
    padding: 0,
    style: {
      overflow: 'hidden',
      boxShadow: t.hot ? 'var(--shadow-stamp-accent)' : 'var(--shadow-stamp)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, t.hot ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--orange-500)',
      color: 'var(--ink-900)',
      fontSize: 11,
      fontWeight: 800,
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      textAlign: 'center',
      padding: '7px 0'
    }
  }, "Most popular") : /*#__PURE__*/React.createElement("div", {
    style: {
      height: 31
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 26px 26px',
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--gray-500)'
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '10px 0 4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...mono,
      fontSize: 40,
      fontWeight: 600,
      color: 'var(--ink-900)'
    }
  }, t.price), /*#__PURE__*/React.createElement("span", {
    style: {
      ...mono,
      fontSize: 14,
      color: 'var(--gray-500)'
    }
  }, t.per)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--gray-500)',
      marginBottom: 18
    }
  }, t.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9,
      marginBottom: 24
    }
  }, t.feats.map(f => /*#__PURE__*/React.createElement("span", {
    key: f,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      fontSize: 13.5,
      color: 'var(--gray-700)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14,
    style: {
      color: 'var(--green-600)'
    }
  }), f))), /*#__PURE__*/React.createElement(Button, {
    variant: t.v,
    style: {
      marginTop: 'auto',
      width: '100%'
    }
  }, t.cta)))))));
}
function Footer() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ink-900)',
      color: 'var(--gray-400)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: 'var(--hazard-stripe)'
    }
  }), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '56px 32px 40px',
      display: 'flex',
      gap: 48,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 260px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: dsp(14, {
      color: 'var(--paper-50)',
      marginBottom: 12
    })
  }, "Automated Estimating", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--orange-500)'
    }
  }, ".")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 'var(--leading-body)',
      maxWidth: 280
    }
  }, "Real BLS data. Your region. Your margins.")), [['Product', ['Estimating', 'Regional rates', 'Sales reps', 'Integrations']], ['Company', ['About', 'Careers', 'Contact']], ['Resources', ['Data methodology', 'Help center', 'API docs']]].map(([h, ls]) => /*#__PURE__*/React.createElement("div", {
    key: h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 640,
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--gray-500)',
      marginBottom: 12
    }
  }, h), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, ls.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      color: 'var(--gray-300)',
      textDecoration: 'none',
      fontSize: 13
    }
  }, l)))))), /*#__PURE__*/React.createElement(Wrap, {
    style: {
      padding: '0 32px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12,
      color: 'var(--gray-500)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Automated Estimating, Inc."), /*#__PURE__*/React.createElement("span", {
    style: mono
  }, "Data: BLS OEWS \xB7 PPI \xB7 Q2 2026")));
}
function Site() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SiteNav, null), /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(Features, null), /*#__PURE__*/React.createElement(DataBand, null), /*#__PURE__*/React.createElement(Pricing, null), /*#__PURE__*/React.createElement(Footer, null));
}
Object.assign(window, {
  Site
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Site.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
