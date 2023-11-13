/*
jQWidgets v10.1.6 (2020-Oct)
Copyright (c) 2011-2020 jQWidgets.
License: https://jqwidgets.com/license/
*/
/* eslint-disable */

(function (a) {
    a.jqx.jqxWidget("jqxPivotGrid", "", {});
    a.extend(a.jqx._jqxPivotGrid.prototype, {
        defineInstance: function () {
            var b = {
                scrollBarsEnabled: true,
                source: null,
                groupingColumns: [],
                isGroupingEnabled: false,
                _offsetX: 0,
                _offsetY: 0,
                _currentPosition: {},
                _selectStartPosition: {},
                _isMouseLeftButtonDown: false,
                _timeLastUp: new Date(),
                _timeLastDown: new Date(),
                resizeTooltipEnabled: false,
                isHorizontalResize: true,
                _colResizeState: "NO_RESIZE",
                activeEditor: {
                    Editor: null
                },
                _id: 0,
                _colItemRangeSelectionBeg: null,
                _colItemRangeSelectionEnd: null,
                _rowItemRangeSelectionBeg: null,
                _rowItemRangeSelectionEnd: null,
                _isCTRLPressed: false,
                _internalSelectMode: "CELLS_SELECT",
                _mostRightItemBounds: {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                },
                _mostLeftItemBounds: {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                },
                _adjSelectedItemsSave: {},
                multipleSelectionEnabled: true,
                selectionEnabled: true,
                selectionMode: "CELLS_SELECT",
                treeStyleRows: true,
                autoResize: false,
                cellsRenderer: null,
                itemsRenderer: null,
                localization: null
            };
            a.extend(true, this, b);
            this._createPivotAreas();
            return b
        },
        _createPivotAreas: function () {
            if (this._pivotRows) {
                this._pivotRows.clear();
                delete this._pivotRows
            }
            if (this._pivotColumns) {
                this._pivotColumns.clear();
                delete this._pivotColumns
            }
            if (this._pivotCells) {
                this._pivotCells._resetCanvas();
                this._pivotCells.clear();
                delete this._pivotCells
            }
            this._pivotRows = new a.jqx.jqxPivotGrid.pivotRows(this);
            this._pivotColumns = new a.jqx.jqxPivotGrid.pivotColumns(this);
            this._pivotCells = new a.jqx.jqxPivotGrid.pivotCells();
            this._pivotCells.parentPivotGrid = this
        },
        _instanceId: 0,
        createInstance: function (j) {
            var f = this.element;
            var k = this.host;
            var l = this;
            l.localizeStrings(l.localization);
            var b = "jqx-pivotgrid jqx-rc-all jqx-widget " + this.toThemeProperty("jqx-widget-content");
            var g = "";
            if (this._isTouchDevice()) {
                g = "class='jqx-grid-menu-item-touch'"
            }
            k.append("<div class='" + b + "' style='width:100%; height: 100%; overflow:hidden; position:relative; onselectstart='return false;' oncontextmenu='return false;''><div id='divContent' style='width:100px; height:100%;'></div><div id='divHScroll' style='width:100%; height:13px;'></div><div id='divVScroll' style='width:13px; height:100%;'></div><div id='divContextMenu'><ul><li " + g + "><div id='sortasc' class='jqx-pivotgrid-sortasc-icon'></div><span>" + l._localizedStrings.sortascendingstring + "</span></li><li " + g + "><div id='sortdesc' class='jqx-pivotgrid-sortdesc-icon'></div><span>" + l._localizedStrings.sortdescendingstring + "</span></li><li " + g + "><div id='sortremove' class='jqx-pivotgrid-sortremove-icon'></div><span>" + l._localizedStrings.sortremovestring + "</span></li></ul></div></div>");
            var c = k.find("#divContent");
            var d = c[0];
            var i = document.createElement("div");
            i.style.position = "relative";
            i.style.left = "0px";
            i.style.top = "0px";
            i.style.width = "100%";
            i.style.height = "100%";
            i.style.overflow = "hidden";
            c.append(i);
            this.contentCanvas = this.Canvas = i;
            this.hostVScroll = k.find("#divVScroll");
            this.hostHScroll = k.find("#divHScroll");
            this.hScroll = k.find("#divHScroll").jqxScrollBar({
                vertical: false,
                theme: this.theme
            });
            this.vScroll = k.find("#divVScroll").jqxScrollBar({
                vertical: true,
                theme: this.theme
            });
            l._createContextMenu();
            l.id = l._instanceId++;
            l._resizeLineId = "divResizeLine" + l.id;
            a(document.body).append("<div id='" + l._resizeLineId + "' style='position: absolute; display: none;'></div>");
            try {
                l.dataBind()
            } catch (h) {
                throw "Databinding exception: " + h.toString();
                return
            }
            l._installEventHandlers();
            a.jqx.utilities.resize(l.host, function () {
                l.refresh()
            }, false);
            if (!l._isInitialized) {
                l._isInitialized = true
            }
        },
        destroy: function () {
            this._isInitialized = false;
            this.host.find("#divHScroll").off();
            this.host.find("#divVScroll").off();
            this._contextMenu.off();
            this.removeHandler(this.host);
            a.jqx.utilities.resize(this.host, null, true)
        },
        _installEventHandlers: function () {
            var b = this;
            b.hostVScroll.on("valueChanged", function (c) {
                if (c.currentTarget == b.hostVScroll[0]) {
                    b.onVScroll(c.currentValue)
                }
            });
            b.hostHScroll.on("valueChanged", function (c) {
                if (c.currentTarget == b.hostHScroll[0]) {
                    b.onHScroll(c.currentValue)
                }
            });
            b.addHandler(b.host, "mousewheel DOMMouseScroll", function (c) {
                if (b._isContextMenuOpen) {
                    return
                }
                if (b._pivotDesigner && b._pivotDesigner._isWindowOpen()) {
                    return
                }
                var d = a.jqx.position(c);
                if (!b.isPtInRect({
                        x: d.left,
                        y: d.top
                    }, b._rect)) {
                    return
                }
                c.preventDefault();
                if (!b._scrollBarPositions.vertical.visible) {
                    return
                }
                b.onMouseWheel(c)
            });
            b.addHandler(b.host, "mouseenter", function (c) {
                if (c.currentTarget == b.element) {
                    b._onMouseEnter(c)
                }
            });
            b.addHandler(b.host, "mouseleave", function (c) {
                if (c.currentTarget == b.element) {
                    b._onMouseLeave(c)
                }
            });
            b.addHandler(b.host, "mousedown", function (c) {
                if (b._isContextMenuOpen) {
                    return
                }
                if (b._pivotDesigner && b._pivotDesigner._isWindowOpen()) {
                    return
                }
                c.preventDefault();
                b._onMouseDown(c);
                this.focus()
            });
            b.addHandler(a(document), "mouseup", function (c) {
                if (b._isContextMenuOpen) {
                    return
                }
                if (b._pivotDesigner && b._pivotDesigner._isWindowOpen()) {
                    return
                }
                c.preventDefault();
                b._onMouseUp(c);
                if (c.cancel) {
                    return
                }
                var d = a.jqx.position(c);
                if (!b.isPtInRect({
                        x: d.left,
                        y: d.top
                    }, b._rect)) {
                    if (b._colResizeState != "RESIZING") {
                        return
                    }
                }
                b._onMouseClick(c)
            });
            b.addHandler(a(document), "mousemove", function (c) {
                if (b._isContextMenuOpen) {
                    return
                }
                if (b._pivotDesigner && b._pivotDesigner._isWindowOpen()) {
                    return
                }
                b._onMouseMove(c)
            });
            b.addHandler(a(document), "keydown", function (c) {
                if (b._isContextMenuOpen) {
                    return
                }
                if (b._pivotDesigner && b._pivotDesigner._isWindowOpen()) {
                    return
                }
                if (b._isContextMenuOpen) {
                    return
                }
                if (c.keyCode == 17) {
                    b._isCTRLPressed = true
                } else {
                    if (c.keyCode == 16) {
                        b._isSHIFTPressed = true
                    } else {
                        if (b._handleKeyboardNavigation) {
                            b._handleKeyboardNavigation(c)
                        }
                    }
                }
            });
            b.addHandler(a(document), "keyup", function (c) {
                if (b._isContextMenuOpen) {
                    return
                }
                if (b._pivotDesigner && b._pivotDesigner._isWindowOpen()) {
                    return
                }
                if (b._isContextMenuOpen) {
                    return
                }
                if (c.keyCode == 17) {
                    b._isCTRLPressed = false
                } else {
                    if (c.keyCode == 16) {
                        b._isSHIFTPressed = false
                    }
                }
            })
        },
        _createContextMenu: function () {
            var k = this;
            var j = this.host;
            var h = j.find("#divContextMenu");
            k._contextMenu = h.jqxMenu({
                width: "120px",
                autoCloseOnClick: true,
                autoOpenPopup: false,
                animationShowDuration: 0,
                animationHideDuration: 0,
                animationShowDelay: 0,
                theme: this.theme,
                keyboardNavigation: false,
                mode: "popup"
            });
            var f = h.find("li");
            var b = "";
            for (var d = 0; d < f.length; d++) {
                var g = a(f[d]).text();
                if (g.length > b.length) {
                    b = g
                }
            }
            var c = a('<span style="white-space:nowrap;">' + b + "</span>");
            c.addClass(this.toThemeProperty("jqx-menu-item"));
            this.host.append(c);
            var e = c.outerWidth() + 30;
            c.remove();
            k._contextMenu = h.jqxMenu({
                width: e
            });
            k._contextMenu.on("shown", function () {
                k._isContextMenuOpen = true
            });
            k._contextMenu.on("closed", function () {
                k._isContextMenuOpen = false;
                k._hideItemMenuElement()
            });
            k._contextMenu.on("itemclick", function (n) {
                n.stopImmediatePropagation();
                n.stopPropagation();
                var m = k._menuElement._itemMouseOver;
                if (!m) {
                    return
                }
                var l = m.hierarchy == k._pivotColumns ? k._pivotRows : k._pivotColumns;
                var i = n.args.innerHTML;
                if (i.indexOf("sortasc") != -1) {
                    l.sortBy(m, "asc")
                } else {
                    if (i.indexOf("sortdesc") != -1) {
                        l.sortBy(m, "desc")
                    } else {
                        if (i.indexOf("sortremove") != -1) {
                            l.removeSort()
                        }
                    }
                }
            })
        },
        _isTouchDevice: function () {
            if (this.touchDevice != undefined) {
                return this.touchDevice
            }
            var b = a.jqx.mobile.isTouchDevice();
            this.touchDevice = b;
            if (this.touchmode == true) {
                if (a.jqx.browser.msie && a.jqx.browser.version < 9) {
                    this.enablehover = false;
                    return false
                }
                b = true;
                a.jqx.mobile.setMobileSimulator(this.element);
                this.touchDevice = b
            } else {
                if (this.touchmode == false) {
                    b = false
                }
            }
            if (b && this.touchModeStyle != false) {
                this.touchDevice = true;
                this.host.addClass(this.toThemeProperty("jqx-touch"));
                this.host.find("jqx-widget-content").addClass(this.toThemeProperty("jqx-touch"));
                this.host.find("jqx-widget-header").addClass(this.toThemeProperty("jqx-touch"));
                this.scrollbarsize = this.touchscrollbarsize
            }
            return b
        },
        propertyChangedHandler: function (b, c, e, d) {
            if (this._isInitialized == undefined || this._isInitialized == false) {
                return
            }
            if (c == "source") {
                this.dataBind()
            } else {
                if (c == "theme") {
                    this.hostVScrollBar.jqxScrollBar("theme", this.theme);
                    this.hostHScrollBar.jqxScrollBar("theme", this.theme)
                }
            }
            this._internalRefresh()
        },
        genId: function () {
            return this._id++
        },
        getCellId: function (b, c) {
            return b.id + "_" + c.id
        },
        _scrollTimer: undefined,
        _renderOnTimeout: function (c) {
            clearTimeout(this._scrollTimer);
            var b = this;
            if (c == 0) {
                this._pivotColumns._refreshRequired = this._pivotRows._refreshRequired = true;
                b._internalRefresh()
            } else {
                this._scrollTimer = setTimeout(function () {
                    b._render()
                }, c)
            }
        },
        onVScroll: function (b) {
            b = Math.round(b);
            if (b == this._offsetY) {
                return
            }
            var d = 50;
            var c = 0;
            this._offsetY = b;
            this._renderOnTimeout(c)
        },
        onHScroll: function (b) {
            b = Math.round(b);
            if (b == this._offsetX) {
                return
            }
            var d = 50;
            var c = 0;
            this._offsetX = b;
            this._renderOnTimeout(c)
        },
        onMouseWheel: function (d) {
            var f = 0;
            if (!d) {
                d = window.event
            }
            if (d.wheelDelta) {
                f = d.wheelDelta / 120
            } else {
                if (d.detail) {
                    f = -d.detail / 3
                }
            }
            if (!f) {
                return
            }
            if (d.preventDefault) {
                d.preventDefault()
            }
            d.returnValue = false;
            var c = this.vScroll.jqxScrollBar("min");
            var b = this.vScroll.jqxScrollBar("max");
            var e = this.vScroll.jqxScrollBar("value");
            f *= 10;
            e = e - f;
            if (e > b) {
                e = b
            }
            if (e < c) {
                e = c
            }
            this.vScroll.jqxScrollBar("value", e)
        },
        _onMouseMove: function (c) {
            var d = a.jqx.position(c);
            var b = d.left;
            var g = d.top;
            if (!this.isPtInRect({
                    x: b,
                    y: g
                }, this._rect)) {
                if (this._colResizeState != "RESIZING") {
                    return
                }
            }
            var f = this.host.offset();
            b -= Math.round(f.left);
            g -= Math.round(f.top);
            b = Math.max(b, 0);
            g = Math.max(g, 0);
            if (this._currentPosition.x == b && this._currentPosition.y == g) {
                return
            } else {
                this._currentPosition.x = b;
                this._currentPosition.y = g
            }
            for (var e in this._scrollBarPositions) {
                if (this._scrollBarPositions[e].visible && this.isPtInRect({
                        x: b,
                        y: g
                    }, this._scrollBarPositions[e].rect)) {
                    return
                }
            }
            this._handleMouseMove(c);
            if (this.activeEditor && this.activeEditor.Editor) {} else {}
        },
        _onMouseEnter: function (b) {},
        _onMouseLeave: function (b) {
            this._hideItemMenuElement()
        },
        _onMouseDown: function (e) {
            var b = {
                isOnItemButton: false
            };
            var d = this._itemHitTest(this._currentPosition, b);
            if (null != d) {
                var c = this._raisePivotItemMouseEvent(d, "pivotitemmousedown", e.button == 0 ? "left" : "right");
                if (c) {
                    e.cancel = true;
                    return
                }
            }
            if (e.button == 0) {
                this.onMouseLeftButtonDown(e)
            } else {
                if (e.button == 2) {
                    this.onMouseRightButtonDown(e)
                }
            }
        },
        _onMouseUp: function (e) {
            var b = {
                isOnItemButton: false
            };
            var d = this._itemHitTest(this._currentPosition, b);
            if (d != null) {
                var c = this._raisePivotItemMouseEvent(d, "pivotitemmouseup", e.button == 0 ? "left" : "right");
                if (c) {
                    e.cancel = true;
                    return
                }
            }
            if (e.button == 0) {
                this.onMouseLeftButtonUp(e)
            } else {
                if (e.button == 2) {
                    this.onMouseRightButtonUp(e)
                }
            }
        },
        _onMouseClick: function (d) {
            var b = this;
            var c = d;
            b._handleMouseClick(d);
            if (d.cancel) {
                return
            }
            if (b._dtLastMouseClick) {
                var e = new Date() - b._dtLastMouseClick;
                if (e < 500) {
                    this._handleMouseDoubleClick(d);
                    b._dtLastMouseClick = undefined;
                    return
                }
            }
            b._dtLastMouseClick = new Date()
        },
        setDivContent: function (f, c, d, g, e) {
            var b = this.getChild(f, "innerDiv");
            b.style.padding = d.top + "px " + d.right + "px " + d.bottom + "px " + d.left + "px";
            if (g) {
                b.style["text-align"] = g
            }
            this.setElementSize(f, parseFloat(f.style.width), parseFloat(f.style.height));
            if (e) {
                b.style.width = parseFloat(f.style.width) - d.left + "px"
            }
            b.innerHTML = c
        },
        setElementPosition: function (c, b, d) {
            c.style.position = "absolute";
            c.style.left = b + "px";
            c.style.top = d + "px"
        },
        _getFloat: function (b) {
            var d;
            for (var c = 0; c < b.length; c++) {
                d = parseFloat(b[c]);
                if (!isNaN(d)) {
                    return d
                }
            }
            return NaN
        },
        setElementSize: function (j, b, f) {
            j.style.width = b + "px";
            j.style.height = f + "px";
            var e = this.getChild(j, "innerDiv");
            if (e) {
                var i = this._getFloat([e.style.padding.left, e.style.padding, 0]);
                var d = this._getFloat([e.style.padding.right, e.style.padding, 0]);
                var g = this._getFloat([e.style.padding.top, e.style.padding, 0]);
                var c = this._getFloat([e.style.padding.bottom, e.style.padding, 0]);
                e.style.width = (b - i - d) + "px";
                e.style.height = (f - g - c) + "px"
            }
        },
        createCanvas: function (b) {
            var c = document.createElement("div");
            c.style["background-color"] = "transparent";
            c.style.overflow = "hidden";
            b.appendChild(c);
            return c
        },
        createDiv: function (c, d, f, b) {
            var g = document.createElement("div");
            g.id = d;
            g.style.height = b + "px";
            g.style.width = f + "px";
            var e = document.createElement("div");
            e.id = "innerDiv";
            e.style.height = b + "px";
            e.style.width = f + "px";
            g.appendChild(e);
            c.appendChild(g);
            return g
        },
        getPivotRows: function () {
            return this._pivotRows
        },
        getPivotColumns: function () {
            return this._pivotColumns
        },
        getPivotCells: function () {
            return this._pivotCells
        },
        _layout: function () {
            var d = this.host.find("#divContent");
            var f = this.host.find("#divVScroll");
            var c = this.host.find("#divHScroll");
            var e = this.host.width();
            var b = this.host.height();
            if (!this._pivotCells.Canvas) {
                this._pivotCells.Canvas = this.createCanvas(this.Canvas, "divCells", 100, 100)
            }
            if (!this._pivotRows.Canvas) {
                this._pivotRows.Canvas = this.createCanvas(this.Canvas, "divRowsHierarchy", 100, 100)
            }
            if (!this._pivotColumns.Canvas) {
                this._pivotColumns.Canvas = this.createCanvas(this.Canvas, "divColumnsHierarchy", 100, 100)
            }
            if (this._pivotRows.isHidden) {
                this._pivotRows.Canvas.style.display = "none"
            } else {
                this._pivotRows.Canvas.style.display = "block";
                this.setElementPosition(this._pivotRows.Canvas, this._pivotRows.x, this._pivotRows.y);
                this.setElementSize(this._pivotRows.Canvas, this._pivotRows.getWidth() + 1, this._pivotRows.getHeight());
                if (this._pivotRows.renderCanvas == undefined) {
                    this._pivotRows.renderCanvas = this.createCanvas(this._pivotRows.Canvas, "divRowsRender", 100, 100)
                }
                this.setElementSize(this._pivotRows.renderCanvas, this._pivotRows.getWidth() + 1, this._pivotRows.getHeight())
            }
            if (this._pivotColumns.isHidden) {
                this._pivotColumns.Canvas.style.display = "none"
            } else {
                this._pivotColumns.Canvas.style.display = "block";
                this.setElementPosition(this._pivotColumns.Canvas, this._pivotColumns.x, this._pivotColumns.y);
                this.setElementSize(this._pivotColumns.Canvas, this._pivotColumns.getWidth(), this._pivotColumns.getHeight() + 1);
                if (this._pivotColumns.renderCanvas == undefined) {
                    this._pivotColumns.renderCanvas = this.createCanvas(this._pivotColumns.Canvas, "divColumnsRender", 100, 100)
                }
                this.setElementSize(this._pivotColumns.renderCanvas, this._pivotColumns.getWidth(), this._pivotColumns.getHeight() + 1)
            }
            this.setElementPosition(this._pivotCells.Canvas, this._pivotColumns.x, this._pivotRows.y);
            this.setElementSize(this._pivotCells.Canvas, this._pivotCells.viewPort.width, this._pivotCells.viewPort.height);
            if (this._pivotCells.renderCanvas == undefined) {
                this._pivotCells.renderCanvas = this.createCanvas(this._pivotCells.Canvas, "divCellsRender", 100, 100)
            }
            this.setElementSize(this._pivotCells.renderCanvas, this._pivotColumns.getWidth() + 1, this._pivotRows.getHeight() + 1)
        },
        refresh: function () {
            this._pivotColumns._renderRequired = true;
            this._pivotRows._renderRequired = true;
            this._pivotCells.clear();
            this._internalRefresh()
        },
        _internalRefresh: function () {
            var h = this.host.offset();
            if (this.autoResize) {
                var d = this._pivotColumns.isHidden ? 0 : this._pivotColumns.getHeight();
                var f = this._pivotColumns.isHidden ? 0 : this._pivotColumns.getWidth();
                var e = this._pivotRows.isHidden ? 0 : this._pivotRows.getHeight();
                var c = this._pivotRows.isHidden ? 0 : this._pivotRows.getWidth();
                var g = {};
                g.width = f + c + 1;
                g.height = d + e + 1;
                if (g.width != this.host.width() || g.height != this.host.height()) {
                    this._pivotColumns._renderRequired = this._pivotRows._renderRequired = true;
                    this.host.css({
                        width: g.width + "px",
                        height: g.height + "px"
                    })
                }
            }
            this._rect = {
                x: h.left,
                y: h.top,
                width: this.host.width(),
                height: this.host.height()
            };
            this._render();
            var b = this.host.find("#divHScroll");
            b.jqxScrollBar("refresh")
        },
        _render: function () {
            var b = this._pivotColumns._renderRequired || this._pivotRows._renderRequired;
            if (this._pivotRows.compactStyleRenderingEnabled != this.treeStyleRows) {
                this._pivotRows.compactStyleRenderingEnabled = this.treeStyleRows;
                b = true
            }
            if (b) {
                this._pivotRows._renderRequired = this._pivotColumns._renderRequired = true;
                this.RenderGridContent();
                this._layout()
            }
            this._pivotRows.viewPort.y = this._offsetY + (this._pivotColumns.isVisible() ? this._pivotColumns.viewPort.height : 0);
            this._pivotColumns.viewPort.x = this._offsetX + (this._pivotRows.isVisible() ? this._pivotRows.viewPort.width : 0);
            this._pivotColumns.refresh();
            this._pivotRows.refresh();
            this._pivotCells.render();
            this._updateMenuElement()
        },
        _updateMenuElement: function () {
            var b = this.host.find("#divContent");
            var d = b[0];
            if (this._menuElement) {
                a(this._menuElement).off();
                d.removeChild(this._menuElement)
            }
            var e = document.createElement("div");
            e.style.height = "16px";
            e.style.width = "16px";
            e.style.id = "menu_element";
            e.style.align = "left";
            e.style.valign = "top";
            e.style.display = "none";
            d.appendChild(e);
            this._menuElement = e;
            var c = this;
            a(c._menuElement).on("click", function () {
                c._showItemContextMenu()
            })
        },
        dataBind: function () {
            var c = this.source;
            if (this.localization && !c.localization) {
                c.localization = this.localization
            }
            c.dataBind();

            function b(l, k, d, f, j) {
                for (var g in l.items) {
                    var h = l.items[g];
                    var e = new a.jqx.jqxPivotGrid.pivotItem(d, f);
                    e.text = h.text;
                    e.adapterItem = h;
                    e.isColumn = j;
                    k.items.push(e);
                    b(h, e, e, f, j)
                }
                for (var g in l.valueItems) {
                    var h = l.valueItems[g];
                    var e = new a.jqx.jqxPivotGrid.pivotItem(d, f);
                    e.adapterItem = h;
                    e.text = h.text;
                    e.isColumn = j;
                    e._isValueItem = true;
                    k.valueItems.push(e);
                    b(h, e, e, f, j)
                }
            }
            this._createPivotAreas();
            b(c._rowsHierarchy, this._pivotRows, null, this._pivotRows, false);
            b(c._columnsHierarchy, this._pivotColumns, null, this._pivotColumns, true);
            this.bindingState = "DataBoundPivot";
            this._pivotRows.autoResize("default");
            this._pivotColumns.autoResize("default");
            this._internalRefresh()
        },
        getChild: function (d, e) {
            var c = d.childNodes;
            for (var b = 0; b < c.length; b++) {
                if (c[b].id == e) {
                    return c[b]
                }
            }
            return null
        },
        scrollToOffset: function (c, e) {
            var b = this.gridcells;
            for (var d = 0; d < b.length; d++) {
                b[d].style.top = e + parseInt(b[d].originalY) + "px";
                this.setDivContent(b[d], "cell " + d)
            }
        },
        getWidth: function () {
            return this.host.width()
        },
        getHeight: function () {
            return this.host.height()
        },
        RenderGridContent: function () {
            if (!this._pivotColumns._renderRequired && !this._pivotRows._renderRequired) {
                this._pivotRows.viewPort.y = this._offsetY;
                this._pivotColumns.viewPort.x = this._offsetX;
                return
            }
            if (this.PaintSuspended) {
                return
            }
            if (this._colResizeState == "RESIZING") {
                return
            }
            var k = {};
            k.x = this._offsetX;
            k.y = this._offsetY;
            k.width = this.getWidth();
            k.height = this.getHeight();
            if (k.width == 0 || k.height == 0) {
                return
            }
            this.PaintSuspended = true;
            if (this._pivotColumns._isColumnsCountRequresUpdate) {
                this._pivotColumns._updateVisibleLeaves();
                this._pivotColumns._updateColumnsCount();
                this._pivotColumns._updateColumnsIndexes()
            }
            if (this._pivotRows._isColumnsCountRequresUpdate) {
                this._pivotRows._updateColumnsCount();
                this._pivotRows._updateColumnsIndexes()
            }
            if (this.getWidth() == 0 || this.getHeight() == 0) {
                this.PaintSuspended = false;
                return
            }
            if (this.GroupingEnabled && this.groupingColumns.length > 0) {
                this._pivotRows.isHidden = true
            }
            if (this._pivotColumns._renderRequired) {
                this._pivotColumns.render()
            }
            if (this._pivotRows._renderRequired) {
                this._pivotRows.render()
            }
            var c = (this._pivotColumns.isVisible() ? this._pivotColumns.getHeight() : 0);
            var h = (this._pivotRows.isVisible() ? this._pivotRows.getWidth() : 0);
            var i = {
                width: this._pivotColumns.getWidth() + h,
                height: this._pivotRows.getHeight() + c
            };
            if (this.scrollableAreaSize != i || this.isSyncScrollRequired) {
                this.scrollableAreaSize = i;
                this.SynchronizeScrollBars()
            }
            var b = this.host.find("#divContent");
            var l = this.host.find("#divVScroll");
            var e = this.host.find("#divHScroll");
            var d = e.css("display") != "none";
            var g = l.css("display") != "none";
            b.css({
                height: (k.height - (d ? e.height() + 4 : 0)) + "px"
            });
            b.css({
                width: (k.width - (g ? l.width() + 4 : 0)) + "px"
            });
            var j = k.height;
            if (k.height == this.getHeight()) {
                j = k.height - c - ((d) ? e.height() + 4 : 0);
                if (j < 0) {
                    j = k.height
                }
            }
            this._pivotRows.x = 0;
            this._pivotRows.y = c;
            this._pivotRows.viewPort = {
                x: this._pivotRows.x,
                y: k.y,
                width: this._pivotRows.getWidth(),
                height: j
            };
            var f = k.width;
            if (k.width == this.getWidth()) {
                f = k.width - h - ((g) ? l.width() + 4 : 0);
                if (f < 0) {
                    f = k.width
                }
            }
            this._pivotColumns.x = h;
            this._pivotColumns.y = 0;
            this._pivotColumns.viewPort = {
                x: k.x,
                y: this._pivotColumns.y,
                width: f,
                height: this._pivotColumns.getHeight()
            };
            this._pivotCells.Bounds = {
                x: this._pivotColumns.x,
                y: this._pivotRows.y,
                width: this._pivotColumns.getWidth(),
                height: j
            };
            this._pivotCells.viewPort = {
                x: k.x,
                y: k.y,
                width: f,
                height: j
            };
            if (this.draggingItem != null && this.dragElement.visibility == "visible") {
                this.dragElement.setValue(this.Canvas.ZIndexProperty, 10000)
            }
            this._pivotRows._renderRequired = false;
            this._pivotColumns._renderRequired = false;
            this.PaintSuspended = false
        },
        SynchronizeScrollBars: function () {
            var p = false;
            var e = false;
            var n = this.host.find("#divVScroll");
            var h = this.host.find("#divHScroll");
            var g = h.css("display") != "none";
            var j = n.css("display") != "none";
            var d = h.height();
            var k = false;
            var m = false;
            if (this.scrollableAreaSize.height > this.getHeight()) {
                p = true
            }
            if (this.scrollableAreaSize.width > this.getWidth()) {
                e = true
            }
            if (this.scrollableAreaSize.height <= this.getHeight() && this.scrollableAreaSize.width <= this.getWidth()) {
                p = false;
                e = false
            }
            if (p) {
                e = e || (this.scrollableAreaSize.width > this.getWidth() - d)
            }
            if (e) {
                p = p || (this.scrollableAreaSize.height > this.getHeight() - d)
            }
            if (p) {
                if (!j) {
                    k = true
                }
                n[0].style.display = "block";
                var c = this.getHeight() - (e ? d + 5 : 0);
                if (c < 0) {
                    c = 0
                }
                this.setElementPosition(n[0], this.getWidth() - d - 4, 0);
                this.setElementSize(n[0], d, c);
                n.jqxScrollBar("min", 0);
                var i = this.scrollableAreaSize.height - (this.getHeight() - (e ? d : 0)) + 4;
                if (i != n.jqxScrollBar("max")) {
                    n.jqxScrollBar("max", i)
                }
                if (this.VerticalScrollBarSmallChange != undefined) {
                    n.jqxScrollBar("step", this.VerticalScrollBarSmallChange)
                } else {
                    n.jqxScrollBar("step", 10)
                }
                var l = this.scrollableAreaSize.height / 10;
                if (l < 10) {
                    l = 10
                }
                if (this.VerticalScrollBarLargeChange != undefined) {
                    l = verticalScrollBarLargeChange
                }
                if (n.jqxScrollBar("largestep") != l) {
                    n.jqxScrollBar("largestep", l)
                }
                if (n.jqxScrollBar("largestep") < n.jqxScrollBar("step")) {
                    n.jqxScrollBar("largestep", n.jqxScrollBar("step"))
                }
                if (this.rtl) {} else {}
            } else {
                if (j) {
                    k = true
                }
                n.jqxScrollBar("value", 0);
                n[0].style.display = "none"
            }
            if (e) {
                if (g) {
                    m = true
                }
                h[0].style.display = "block";
                var o = this.getWidth() - (p ? d + 5 : 0);
                if (o < 0 || o == undefined) {
                    o = 0
                }
                this.setElementPosition(h[0], 0, this.getHeight() - d - 4);
                this.setElementSize(h[0], o, d);
                if (h.jqxScrollBar("min") != 0) {
                    h.jqxScrollBar("min", 0)
                }
                var f = this.scrollableAreaSize.width - (this.getWidth() - (p ? d : 0)) + 4;
                if (h.jqxScrollBar("max") != f) {
                    h.jqxScrollBar("max", f)
                }
                if (this.HorizontalScrollBarSmallChange != undefined) {
                    h.jqxScrollBar("step", this.HorizontalScrollBarSmallChange)
                } else {
                    h.jqxScrollBar("step", 10)
                }
                var b = (this.getWidth() / 2);
                if (b < 25) {
                    b = 25
                }
                if (this.HorizontalScrollBarLargeChange != undefined) {
                    b = this.HorizontalScrollBarSmallChange
                }
                h.jqxScrollBar("largestep", b);
                if (h.jqxScrollBar("largestep") < h.jqxScrollBar("largestep")) {
                    h.jqxScrollBar("largestep", h.jqxScrollBar("step"))
                }
            } else {
                if (g) {
                    m = true
                }
                h.jqxScrollBar("value", 0);
                h[0].style.display = "none"
            }
            e = e && this.scrollBarsEnabled;
            p = p && this.scrollBarsEnabled;
            if (e != (h[0].display == "block")) {
                h[0].display = e ? "block" : "none";
                m = true
            }
            if (p != (n[0].display == "block")) {
                n[0].display = p ? "block" : "none";
                k = true
            }
            this._scrollBarPositions = {
                vertical: {
                    visible: p,
                    rect: {
                        x: n.position().left,
                        y: n.position().top,
                        width: n.width(),
                        height: n.height()
                    }
                },
                horizontal: {
                    visible: e,
                    rect: {
                        x: h.position().left,
                        y: h.position().top,
                        width: h.width(),
                        height: h.height()
                    }
                }
            };
            h.jqxScrollBar("refresh");
            n.jqxScrollBar("refresh")
        },
        isPtInRect: function (b, c) {
            return (b.x >= c.x && b.x <= c.x + c.width && b.y >= c.y && b.y <= c.y + c.height)
        },
        onMouseLeftButtonUp: function (c) {
            var j = this;
            for (var k in j._scrollBarPositions) {
                if (this._scrollBarPositions[k].visible && this.isPtInRect(j._currentPosition, j._scrollBarPositions[k].rect)) {
                    if (j._isMouseCaptured()) {
                        j._releaseMouseCapture()
                    }
                    j._isMouseLeftButtonDown = false;
                    return
                }
            }
            if (j._isMouseCaptured()) {
                j._releaseMouseCapture();
                return
            }
            if (j._itemMenuButtonMouseOver || j._isContextMenuOpen) {
                return
            }
            j.canDrag = false;
            var g = a.jqx.position(c);
            var e = j.isPtInRect({
                x: g.left,
                y: g.top
            }, j._rect);
            var d = j._pivotCells._hitTest(j._currentPosition);
            if (d && e) {
                var h = j._raisePivotCellMouseEvent(d.pivotRow, d.pivotColumn, "pivotcellmouseup", "left");
                if (h) {
                    return
                }
            }
            if (j._colResizeState == "RESIZING") {
                j._colResizeState = "NO_RESIZE";
                j._updateCursor("ARROW");
                j._pivotColumns._renderRequired = true;
                j._pivotRows._renderRequired = true;
                var l = {
                    x: j.resizingItem.x + j.resizingItem.hierarchy.x - j._offsetX,
                    y: j.resizingItem.y + j.resizingItem.hierarchy.y - j._offsetY
                };
                if (this.isHorizontalResize) {
                    j.resizingItem.setWidth(Math.max(j.resizingItem.minimumWidth, Math.abs(j._currentPosition.x - l.x)))
                } else {
                    j.resizingItem.setHeight(Math.max(j.resizingItem.minimumHeight, Math.abs(j._currentPosition.y - l.y)))
                }
                a("body").find("#" + j._resizeLineId).hide();
                j.resizingItem = null;
                if (j.resizeTooltipEnabled) {}
                j._isMouseLeftButtonDown = false;
                j._internalRefresh();
                return
            }
            var f = {
                isOnItemButton: false
            };
            var i = j._itemHitTest(j._currentPosition, f);
            if (i != null) {
                if (f.isOnItemButton || f.isOnMenuButton) {
                    return
                }
            }
            var b = false;
            if (j._canDrop(i)) {
                j._endDrag(i);
                b = true
            } else {
                if (j.dragElement && j.dragElement.style.display == "block") {
                    j._endDrag(draggingItem);
                    b = true
                }
            }
            if (b) {
                j._isMouseLeftButtonDown = false;
                j._internalRefresh();
                return
            }
            j._isMouseLeftButtonDown = false;
            if (e && j.activeEditor.Editor == null) {
                j._updateSelection()
            }
        },
        onMouseLeftButtonDown: function (g) {
            for (var h in this._scrollBarPositions) {
                if (this._scrollBarPositions[h].visible && this.isPtInRect(this._currentPosition, this._scrollBarPositions[h].rect)) {
                    this._captureMouse();
                    return
                }
            }
            var d = {
                isOnItemButton: false
            };
            var f = this._itemHitTest(this._currentPosition, d);
            this._timeLastDown = new Date();
            var c = false;
            if (!this.isShiftPressed) {
                this._selectStartPosition = {
                    x: this._currentPosition.x,
                    y: this._currentPosition.y
                }
            }
            if (this._itemMenuButtonMouseOver || this._isContextMenuOpen) {
                return
            }
            this._isMouseLeftButtonDown = true;
            if (this._colResizeState == "READY_RESIZE") {
                this._colResizeState = "RESIZING";
                this._updateCursor(this.isHorizontalResize ? "COLUMN_RESIZE" : "ROW_RESIZE");
                this._refreshMouseCursor();
                return
            } else {
                if (this._colResizeState == "RESIZING") {
                    return
                }
            }
            if (null != f) {
                if (d.isOnItemButton) {
                    if (this._lastToggle && this._lastToggle.item == f && (new Date() - this._lastToggle.time) < 500) {
                        return
                    }
                    this._isMouseLeftButtonDown = false;
                    if (f.isExpanded) {
                        f.collapse()
                    } else {
                        f.expand()
                    }
                    this._lastToggle = {
                        time: new Date(),
                        item: f
                    };
                    this._internalRefresh();
                    return
                }
                this.canDrag = true;
                if (d.isOnItemButton) {
                    this._updateCursor("ARROW")
                } else {
                    this._updateCursor("CROSS")
                }
                if (f.isColumn) {
                    this._internalSelectMode = "COL_SELECT"
                } else {
                    this._internalSelectMode = "ROW_SELECT"
                }
            } else {
                this._internalSelectMode = "CELLS_SELECT"
            }
            var b = this._pivotCells._hitTest(this._currentPosition);
            if (b) {
                var e = this._raisePivotCellMouseEvent(b.pivotRow, b.pivotColumn, "pivotcellmousedown", "left");
                if (e) {
                    return
                }
            }
            if (this.activeEditor.Editor == null) {
                this._updateSelection()
            }
            this._refreshMouseCursor()
        },
        onMouseRightButtonDown: function (e) {
            this._timeLastDown = new Date();
            var c = {
                isOnItemButton: false
            };
            var d = this._itemHitTest(this._currentPosition, c);
            if (d != null) {
                this._raisePivotItemMouseEvent(d, "pivotitemmousedown", "right");
                return
            }
            var b = this._pivotCells._hitTest(this._currentPosition);
            if (b) {
                this._raisePivotCellMouseEvent(b.pivotRow, b.pivotColumn, "pivotcellmousedown", "right")
            }
        },
        onMouseRightButtonUp: function (d) {
            var c = this;
            var f = a.jqx.position(d);
            var e = c.isPtInRect({
                x: f.left,
                y: f.top
            }, c._rect);
            var b = this._pivotCells._hitTest(this._currentPosition);
            if (b && e) {
                this._raisePivotCellMouseEvent(b.pivotRow, b.pivotColumn, "pivotcellmouseup", "right")
            }
            this._timeLastUp = new Date()
        },
        _itemMouseMove: function (b, g) {
            if (this.resizingItem) {
                if (this.isHorizontalResize) {
                    this._updateCursor("COLUMN_RESIZE")
                } else {
                    this._updateCursor("ROW_RESIZE")
                }
                return
            }
            if (this._menuElement._itemMouseOver != g) {
                this._hideItemMenuElement()
            }
            this._updateCursor("CROSS");
            var h = {
                x: g.x,
                y: g.y,
                width: g.getDisplayWidth(),
                height: g.getDisplayHeight()
            };
            if (g.isColumn) {
                h.x += g.hierarchy.x - this._offsetX
            } else {
                h.y += g.hierarchy.y - this._offsetY
            }
            if (g.IsRowsHierarchyItem && this._pivotRows.compactStyleRenderingEnabled) {
                h.height = g.height
            }
            h.right = h.x + h.width;
            h.bottom = h.y + h.height;
            if (Math.abs(h.right - b.x) <= 4 && b.y >= h.y && b.y <= h.bottom) {
                this.isHorizontalResize = true;
                if (g.hierarchy.resizable && !this._pivotColumns.isGroupingColumn(g)) {
                    this._updateCursor("COLUMN_RESIZE");
                    this.resizingItem = (g.isColumn) ? g._getLastVisibleLeaf(g) : g;
                    if (!this.resizingItem.isColumn && !this.resizingItem.isExpanded) {
                        var d = this._pivotRows._getVisibleLeafLevelItems();
                        for (var c in d) {
                            var e = d[c];
                            if (e.ItemLevel > this.resizingItem.ItemLevel) {
                                this.resizingItem = e
                            }
                        }
                    }
                    this._colResizeState = "READY_RESIZE"
                }
                return
            }
            if (!g.isColumn && Math.abs(h.bottom - b.y) <= 3) {
                this.isHorizontalResize = false;
                if (!(g.IsRowsHierarchyItem && this._pivotRows.compactStyleRenderingEnabled)) {
                    g = g._getLastVisibleLeaf(g)
                }
                if (g.hierarchy.resizable) {
                    this._updateCursor("ROW_RESIZE");
                    this.resizingItem = g;
                    this._colResizeState = "READY_RESIZE"
                }
                return
            }
            var f = g.hierarchy.getOtherHierarchy();
            if (g.hierarchy.sortable && f.items.length > 0) {
                this._hitTestShowItemMenuElement(b, g, h)
            }
        },
        isInHierarchyViewPort: function (b, c) {
            if (c.isColumnsHierarchy) {
                return (this.isPtInRect({
                    x: b.x + this._offsetX,
                    y: b.y
                }, c.viewPort))
            } else {
                return (this.isPtInRect({
                    x: b.x,
                    y: b.y + this._offsetY
                }, c.viewPort))
            }
        },
        _hitTestShowItemMenuElement: function (b, g, h) {
            if (this._menuElement && this._menuElement._itemMouseOver && this._menuElement._itemMouseOver._element) {
                a(this._menuElement._itemMouseOver._element).find("#sortElement").show()
            }
            this._menuElement.style.display = "none";
            if (this._isContextMenuOpen || g.valueItems.length > 0 || !(b.x < h.right && b.x > h.x && b.y >= h.y && b.y <= h.bottom)) {
                return
            }
            var d = a.extend({}, this._rect);
            d.x = d.y = 0;
            if (this.vScroll[0].display == "block") {
                d.width -= this.vScroll.width()
            }
            if (this.hScroll[0].display == "block") {
                d.height -= this.hScroll.height()
            }
            var f = {
                x: this._currentPosition.x,
                y: this._currentPosition.y
            };
            f.x -= g.hierarchy.x - (g.hierarchy.viewPort.x - g.hierarchy.x);
            f.y -= g.hierarchy.y - (g.hierarchy.viewPort.y - g.hierarchy.y);
            var e = {
                x: g.x + h.width - 18,
                y: g.y + (h.height - 16) / 2 + 1,
                width: 16,
                height: 16
            };
            this._menuElement.style.height = e.height + "px";
            this._menuElement.className = this.toThemeProperty("jqx-pivotgrid-menu-button");
            if (g.isColumn) {
                e.x += g.hierarchy.x - this._offsetX
            } else {
                e.y += g.hierarchy.y - this._offsetY
            }
            this.setElementPosition(this._menuElement, e.x, e.y);
            if (this.isPtInRect({
                    x: e.x,
                    y: e.y
                }, d) && this.isPtInRect({
                    x: e.x,
                    y: e.y + e.height
                }, d) && this.isPtInRect({
                    x: e.x + e.width,
                    y: e.y
                }, d) && this.isPtInRect({
                    x: e.x + e.width,
                    y: e.y + e.height
                }, d)) {
                this._menuElement.style.display = "block";
                this._menuElement._itemMouseOver = g;
                a(this._menuElement._itemMouseOver._element).find("#sortElement").hide();
                if (!g._currentCustomContent) {
                    var c = a(g._element).css("background-color");
                    this._menuElement.style["background-color"] = c
                }
                if (g.isColumn) {
                    e.x += this._offsetX - g.hierarchy.x
                } else {
                    e.y += this._offsetY - g.hierarchy.y
                }
                if (this.isPtInRect({
                        x: f.x,
                        y: f.y
                    }, e)) {
                    this._itemMenuButtonMouseOver = true
                }
            }
        },
        _hideItemMenuElement: function () {
            if (this._menuElement && !this._isContextMenuOpen && this._menuElement.style.display == "block") {
                this._menuElement.style.display = "none";
                a(this._menuElement._itemMouseOver._element).find("#sortElement").show()
            }
        },
        _hideItemContextMenu: function () {
            this._contextMenu.jqxMenu("close");
            this._hideItemMenuElement()
        },
        _showItemContextMenu: function () {
            var f = this._menuElement._itemMouseOver;
            if (!f) {
                return
            }
            var e = this._contextMenu.width();
            var c = this._contextMenu.height();
            this._contextMenu.find("#sortasc")[0]["className"] = "jqx-pivotgrid-sortasc-icon " + this.toThemeProperty("jqx-pivotgrid-sortasc-icon");
            this._contextMenu.find("#sortdesc")[0]["className"] = "jqx-pivotgrid-sortdesc-icon " + this.toThemeProperty("jqx-pivotgrid-sortdesc-icon");
            this._contextMenu.find("#sortremove")[0]["className"] = "jqx-pivotgrid-sortremove-icon " + this.toThemeProperty("jqx-pivotgrid-sortremove-icon");
            var d = -e + f.displayWidth + f.x + (f.hierarchy.viewPort.x - this._offsetX) - this._offsetX;
            if (!f.isColumn) {
                d = f.x + f.displayWidth
            }
            var b = f.y + f.getDisplayHeight();
            if (!f.isColumn) {
                b = f.y - this._offsetY + f.hierarchy.y
            }
            if (d <= 1) {
                d = 1
            }
            if (b < this._pivotColumns.y + this._pivotColumns.getHeight()) {
                b = this._pivotColumns.y + this._pivotColumns.getHeight()
            }
            if (b + c > this._rect.height) {
                b = this._rect.height - c
            }
            this._contextMenu.jqxMenu("open", d + this._rect.x, b + this._rect.y);
            this._contextMenu.focus()
        },
        _handleMouseMove: function (d) {
            if (this._colResizeState == "RESIZING") {
                this._doResize({
                    x: this._currentPosition.x,
                    y: this._currentPosition.y
                });
                this._refreshMouseCursor();
                return
            } else {
                this._colResizeState = "NO_RESIZE";
                this.resizingItem = null
            }
            var j = this._currentPosition;
            var i = null;
            if (this.isInHierarchyViewPort({
                    x: j.x,
                    y: j.y
                }, this._pivotColumns)) {
                i = this._pivotColumns.hitTest(j)
            }
            var c = null;
            if (this.isInHierarchyViewPort({
                    x: j.x,
                    y: j.y
                }, this._pivotRows)) {
                c = this._pivotRows.hitTest(j)
            }
            this._itemMenuButtonMouseOver = false;
            if (i != null || c != null) {
                var h = i == null ? c : i;
                this.gridCellMouseOver = null;
                this._itemMouseMove(j, h);
                if (this._focusedItem != h) {
                    this._focusedItem = h;
                    if (this._isMouseLeftButtonDown) {
                        this._updateSelection()
                    }
                }
                var f = {};
                if (this.CellsHighlightOnHierarchyItemMoveEnabled && ((h.IsRowsHierarchyItem && (this.CellsHighlightMode == "CELLS_HIGHLIGHT_ROW")) || (h.isColumn && (this.CellsHighlightMode == "CELLS_HIGHLIGHT_COLUMN")))) {
                    if (h.isColumn) {
                        f = {
                            x: h.x,
                            y: 0,
                            width: h.DisplayWidth,
                            height: this._pivotRows.getHeight()
                        }
                    } else {
                        f = {
                            x: 0,
                            y: h.y,
                            width: this._pivotColumns.getWidth(),
                            height: h.getDisplayHeight()
                        }
                    }
                    if ((h.isColumn && this.isGroupingEnabled && this.groupingColumns.length > 0) || (h.IsRowsHierarchyItem && this._pivotRows.isOnRowDetails(this._currentPosition, h))) {
                        f = {
                            x: 0,
                            y: 0,
                            width: 0,
                            height: 0
                        }
                    }
                }
                this._refreshMouseCursor();
                return
            } else {
                this._hideItemMenuElement()
            }
            var b = this.gridCellMouseOver != null;
            this.resizingItem = null;
            this._focusedItem = null;
            this._colResizeState = "NO_RESIZE";
            this._updateCursor("ARROW");
            var g = null;
            if (this.gridCellMouseOver) {
                g = {};
                g.pivotColumn = this.gridCellMouseOver.pivotColumn;
                g.pivotRow = this.gridCellMouseOver.pivotRow
            }
            var e = this._pivotCells._hitTest(j);
            if (this._isMouseLeftButtonDown && e) {
                if (this.gridCellMouseOver == null || this.gridCellMouseOver.pivotRow != c || this.gridCellMouseOver.pivotColumn != i) {
                    this.gridCellMouseOver = {
                        pivotRow: e.pivotRow,
                        pivotColumn: e.pivotColumn,
                        pivotCells: this._pivotCells
                    }
                }
                var f = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                };
                if (this.cellsHighlightMode == "CELLS_HIGHLIGHT_COLUMN") {
                    f = {
                        x: this.gridCellMouseOver.pivotColumn.x,
                        y: 0,
                        width: this.gridCellMouseOver.pivotColumn.getDisplayWidth(),
                        height: this._pivotRows.getHeight()
                    }
                } else {
                    if (this.cellsHighlightMode == "CELLS_HIGHLIGHT_ROW") {
                        f = {
                            x: 0,
                            y: this.gridCellMouseOver.pivotRow.y,
                            width: this._pivotColumns.getWidth(),
                            height: this.gridCellMouseOver.pivotRow.getDisplayHeight()
                        }
                    } else {
                        if (this.cellsHighlightMode == "CELLS_HIGHLIGHT_SINGLE_CELL") {
                            f = {
                                x: this.gridCellMouseOver.pivotColumn.x,
                                y: this.gridCellMouseOver.pivotRow.y,
                                width: this._pivotColumns.getWidth(),
                                height: this.gridCellMouseOver.pivotRow.getDisplayHeight()
                            };
                            if (this.isGroupingEnabled && this.groupingColumns.length > 0) {
                                if (this.gridCellMouseOver.pivotRow.items.length > 0) {
                                    f = {
                                        x: 0,
                                        y: 0,
                                        width: 0,
                                        height: 0
                                    }
                                }
                            }
                            if (this.gridCellMouseOver.pivotRow.RowDetailsVisible) {
                                f.height -= this.gridCellMouseOver.pivotRow.GetRowDetailsHeight()
                            }
                        }
                    }
                }
                if (this._pivotColumns.isGroupingColumn(this.gridCellMouseOver.pivotColumn) || this._pivotRows.isOnRowDetails(this._currentPosition, this.gridCellMouseOver.pivotRow)) {
                    f = {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0
                    }
                }
            } else {
                this.gridCellMouseOver = null
            }
            if (this.gridCellMouseOver != null && (this.gridCellMouseOver != g || g.pivotRow != this.gridCellMouseOver.pivotRow || g.pivotColumn != this.gridCellMouseOver.pivotColumn)) {
                if (this._isMouseLeftButtonDown && !this._itemMenuButtonMouseOver) {
                    this._updateSelection();
                    this._internalRefresh()
                }
            }
        },
        _handleMouseClick: function (f) {
            var c = {
                isOnItemButton: false
            };
            var g = this._itemHitTest(this._currentPosition, c);
            if (g != null) {
                var d = this._raisePivotItemMouseEvent(g, "pivotitemclick", (f.button == 0) ? "left" : "right");
                if (d) {
                    f.cancel = true;
                    return
                }
                if (this._itemMenuButtonMouseOver || this._isContextMenuOpen) {
                    return
                }
                if (this._isMouseLeftButtonDown && !c.isOnItemButton && g.sortMode == "Automatic" && g.valueItems.length == 0) {
                    var e = this.cursor;
                    this.cursor = "Wait";
                    this.cursor = e
                }
            } else {
                var b = this._pivotCells._hitTest(this._currentPosition);
                if (b) {
                    var d = this._raisePivotCellMouseEvent(b.pivotRow, b.pivotColumn, "pivotcellclick", (f.button == 0) ? "left" : "right");
                    if (d) {
                        f.cancel = true;
                        return
                    }
                }
            }
        },
        _handleMouseDoubleClick: function (g) {
            if (this.activeEditor.Editor != null) {
                var d = null;
                if (false == this.hideEditor("MOUSE_DBLCLICK", d, true)) {
                    return
                }
            }
            if (this._itemMenuButtonMouseOver || this._isContextMenuOpen) {
                return
            }
            var c = {
                isOnItemButton: false
            };
            var f = this._itemHitTest(this._currentPosition, c);
            if (f != null) {
                if (c.isOnMenuButton) {
                    return
                }
                var e = this._raisePivotItemMouseEvent(f, "pivotitemdblclick", (g.button == 0) ? "left" : "right");
                if (e) {
                    return
                }
                if (this._lastToggle && this._lastToggle.item == f && (new Date() - this._lastToggle.time) < 500) {
                    return
                }
                if (g.button == 0) {
                    if (f.isExpanded) {
                        f.collapse()
                    } else {
                        f.expand()
                    }
                    f.hierarchy.selectItem(f);
                    this._internalRefresh()
                }
                this._lastToggle = {
                    time: new Date(),
                    item: f
                }
            } else {
                var b = this._pivotCells._hitTest(this._currentPosition);
                if (b) {
                    var e = this._raisePivotCellMouseEvent(b.pivotRow, b.pivotColumn, "pivotcelldblclick", (g.button == 0) ? "left" : "right");
                    if (e) {
                        return
                    }
                }
            }
            this._refreshMouseCursor()
        },
        _isMouseCaptured: function () {
            return this._captured === true
        },
        _releaseMouseCapture: function () {
            this._captured = false
        },
        _captureMouse: function () {
            this._captured = true
        },
        _updateCursor: function (b) {
            if (b == "ARROW") {
                this.element.style.cursor = "default"
            } else {
                if (b == "CROSS") {
                    this.element.style.cursor = "pointer"
                } else {
                    if (b == "COLUMN_RESIZE") {
                        this.element.style.cursor = "col-resize"
                    } else {
                        if (b == "ROW_RESIZE") {
                            this.element.style.cursor = "row-resize"
                        }
                    }
                }
            }
        },
        _refreshMouseCursor: function () {},
        _ensureEditorFocus: function () {},
        focus: function () {},
        _itemHitTest: function (b, c) {
            c.isOnItemButton = false;
            var g = null;
            if (!this._pivotRows.isHidden && this.isInHierarchyViewPort(b, this._pivotRows)) {
                g = this._pivotRows.hitTest(b)
            }
            if (g == null && !this._pivotColumns.isHidden && this.isInHierarchyViewPort(b, this._pivotColumns)) {
                g = this._pivotColumns.hitTest(b)
            }
            if (g != null) {
                var f = {
                    x: this._currentPosition.x,
                    y: this._currentPosition.y
                };
                f.x -= g.hierarchy.x - (g.hierarchy.viewPort.x - g.hierarchy.x);
                f.y -= g.hierarchy.y - (g.hierarchy.viewPort.y - g.hierarchy.y);
                if (g.items.length != 0 && g.expandCollapseEnabled != false && g.hierarchy.showExpandCollapseButtons) {
                    var e = 0;
                    if (!g.hierarchy.isColumnsHierarchy && g.hierarchy.compactStyleRenderingEnabled) {
                        e = 24 * g.itemLevel
                    }
                    if (f.x > g.x + 9 + e && f.x < g.x + 20 + e && f.y > g.y + 9 && f.y < g.y + 20) {
                        c.isOnItemButton = true
                    }
                }
                var h = {
                    x: g.x,
                    y: g.y,
                    width: g.getDisplayWidth(),
                    height: g.getDisplayHeight()
                };
                var d = {
                    x: g.x + h.width - 16,
                    y: g.y,
                    width: 16,
                    height: h.height
                };
                if (this.isPtInRect(f, d) && g.hierarchy.sortable) {
                    c.isOnMenuButton = true
                }
            }
            return g
        },
        _raisePivotCellMouseEvent: function (g, f, b, c) {
            var e = new a.Event(b);
            e.owner = this;
            e.args = {
                pivotRow: g,
                pivotColumn: f,
                mousebutton: c,
                cancel: false
            };
            var d = this.host;
            d.trigger(e);
            if (e.args.cancel) {
                return true
            }
            return false
        },
        _raisePivotItemMouseEvent: function (d, b, c) {
            var f = new a.Event(b);
            f.owner = this;
            f.args = {
                pivotItem: d,
                mousebutton: c,
                cancel: false
            };
            var e = this.host;
            e.trigger(f);
            if (f.args.cancel) {
                return true
            }
            return false
        },
        _beginDrag: function (b) {},
        _endDrag: function (b) {},
        _canDrop: function (b) {},
        _doResize: function (b) {
            if (!(this.resizingItem != null && this.resizingItem.hierarchy.resizable)) {
                return
            }
            if (this._pivotColumns.isGroupingColumn(this.resizingItem)) {
                return
            }
            if (this.isHorizontalResize) {
                this._updateCursor("COLUMN_RESIZE")
            } else {
                this._updateCursor("ROW_RESIZE")
            }
            this._focusedItem = this.resizingItem;
            var i = {
                x: this.resizingItem.x + 2 * this.resizingItem.hierarchy.x - this.resizingItem.hierarchy.viewPort.x,
                y: this.resizingItem.y + 2 * this.resizingItem.hierarchy.y - this.resizingItem.hierarchy.viewPort.y
            };
            var g = false;
            var e = this.resizingItem.hierarchy;
            var d = a("body").find("#" + this._resizeLineId);
            if (this.isHorizontalResize) {
                var h = b.x - i.x;
                if (h < this.resizingItem.minimumWidth) {
                    return
                }
                var f = {
                    x: b.x + this._rect.x,
                    y: this._pivotRows.y + this._rect.y
                };
                d.css({
                    "border-right": "1px dotted #555",
                    "border-bottom": "",
                    width: "1px",
                    height: this._pivotCells.viewPort.height,
                    top: f.y,
                    left: f.x,
                    display: "block"
                });
                if (h >= this.resizingItem.minimumWidth && h <= this.resizingItem.maximumWidth) {
                    if (this.resizeTooltipEnabled) {
                        this._resizeTooltip.Content = "width: " + h + " pixels"
                    }
                    g = true
                }
            } else {
                var c = b.y - i.y;
                if (c < this.resizingItem.minimumHeight) {
                    return
                }
                var f = {
                    x: this._pivotColumns.x + this._rect.x,
                    y: b.y + this._rect.y
                };
                d.css({
                    "border-bottom": "1px dotted #555",
                    "border-right": "",
                    height: "1px",
                    width: this._pivotCells.viewPort.width,
                    left: f.x,
                    top: f.y,
                    display: "block",
                    zIndex: 50000
                });
                if (c >= this.resizingItem.minimumHeight && c <= this.resizingItem.maximumHeight) {
                    if (this.resizeTooltipEnabled) {
                        this._resizeTooltip.Content = "height: " + c + " pixels"
                    }
                    g = true
                }
            }
            if (g) {
                if (this.resizeTooltipEnabled) {
                    if (this._resizeTooltip.visibility != "visible") {
                        this._resizeTooltip.visibility = "visible"
                    }
                    this._resizeTooltip.setValue(this.Canvas.LeftProperty, b.x);
                    this._resizeTooltip.setValue(this.Canvas.TopProperty, b.y);
                    this._resizeTooltip.setValue(this.Canvas.ZIndexProperty, 10002)
                }
            }
        },
        _internalClearSelection: function () {
            this._pivotColumns._internalClearSelection();
            this._pivotRows._internalClearSelection();
            this._pivotCells._internalClearSelection()
        },
        _beginSelectionUpdate: function () {
            if (this._isCTRLPressed && this.multipleSelectionEnabled) {
                return
            }
            this._pivotCells._beginSelectionUpdate();
            this._pivotColumns._beginSelectionUpdate();
            this._pivotRows._beginSelectionUpdate()
        },
        _endSelectionUpdate: function () {
            this._pivotColumns._endSelectionUpdate();
            this._pivotRows._endSelectionUpdate();
            this._pivotCells._endSelectionUpdate()
        },
        _updateSelection: function () {
            if (!this.selectionEnabled) {
                return
            }
            this._colItemRangeSelectionBeg = null;
            this._rowItemRangeSelectionBeg = null;
            this._beginSelectionUpdate();
            var l = false;
            if (!this._isCTRLPressed || false == this.multipleSelectionEnabled) {
                this._internalClearSelection();
                l = true
            }
            if (this.activeEditor.Editor != null) {
                this._internalClearSelection();
                this._endSelectionUpdate();
                return
            }
            var j = -1;
            var t = -1;
            var g = {
                x: this._selectStartPosition.x,
                y: this._selectStartPosition.y
            };
            g.y -= this._offsetY;
            g.x -= this._offsetX;
            var p = {
                isOnItemButton: false
            };
            var i = this._itemHitTest(this._selectStartPosition, p);
            if (i != null) {
                if (!(!i.isColumn && this._pivotRows.compactStyleRenderingEnabled)) {
                    i = i._getFirstVisibleLeaf(i)
                }
                if (i.isColumn) {
                    if (this.selectionMode == "FULL_ROW_SELECT") {
                        this._internalSelectMode = "NO_SELECT";
                        this._endSelectionUpdate();
                        return
                    } else {
                        this._internalSelectMode = "COL_SELECT"
                    }
                    this._colItemRangeSelectionBeg = i
                } else {
                    if (this.selectionMode == "FULL_COLUMN_SELECT") {
                        this._internalSelectMode = "NO_SELECT";
                        this._endSelectionUpdate();
                        this._internalRefresh();
                        return
                    } else {
                        this._internalSelectMode = "ROW_SELECT"
                    }
                    this._rowItemRangeSelectionBeg = i
                }
            } else {
                var h = this._pivotCells._hitTest(this._selectStartPosition);
                if (h) {
                    this._internalSelectMode = "CELLS_SELECT";
                    if (this.selectionMode == "FULL_ROW_SELECT") {
                        this._internalSelectMode = "ROW_SELECT"
                    } else {
                        if (this._SelectionMode == "FULL_COLUMN_SELECT") {
                            this._internalSelectMode = "COL_SELECT"
                        }
                    }
                } else {
                    this._internalSelectMode = "NO_SELECT";
                    this._endSelectionUpdate();
                    this._internalRefresh();
                    return
                }
            }
            var b = {
                x: this._currentPosition.x,
                y: this._currentPosition.y
            };
            if (this._internalSelectMode == "COL_SELECT") {
                if (b.y >= this._pivotColumns.y + this._pivotColumns.getHeight()) {
                    b.y = this._pivotColumns.y + this._pivotColumns.getHeight() - 1
                }
                if (b.y <= this._pivotColumns.y) {
                    b.y = this._selectStartPosition.y
                }
                if (b.x <= this._pivotColumns.x) {
                    b.x = this._pivotColumns.x + 1
                }
                if (b.x >= this._pivotColumns.x + this._pivotColumns.getWidth()) {
                    b.x = this._pivotColumns.x + this._pivotColumns.getWidth() - 1
                }
            } else {
                if (this._internalSelectMode == "ROW_SELECT") {
                    if (b.y >= this._pivotRows.y + this._pivotRows.getHeight()) {
                        b.y = this._pivotRows.y + this._pivotRows.getHeight() - 1
                    }
                    if (b.y <= this._pivotRows.y) {
                        b.y = this._pivotRows.y + 1
                    }
                    if (b.x <= this._pivotRows.x) {
                        b.x = this._pivotRows.x + this._pivotRows.getWidth() - 1
                    }
                    if (b.x >= this._pivotRows.x + this._pivotRows.getWidth()) {
                        b.x = this._pivotRows.x + this._pivotRows.getWidth() - 1
                    }
                } else {
                    if (this._internalSelectMode == "CELLS_SELECT") {
                        if (b.x < this._pivotColumns.x) {
                            b.x = this._pivotColumns.x + 1
                        }
                        if (b.y < this._pivotRows.y) {
                            b.y = this._pivotRows.y + 1
                        }
                    }
                }
            }
            this._colItemRangeSelectionEnd = null;
            this._rowItemRangeSelectionEnd = null;
            var f = -1;
            var o = -1;
            if (this._internalSelectMode == "COL_SELECT" || this._internalSelectMode == "ROW_SELECT") {
                if (i != null) {
                    var h = {};
                    var d = this._itemHitTest(b, h);
                    if (null == d) {
                        this._endSelectionUpdate();
                        return
                    }
                    if (!(!d.isColumn && this._pivotRows.compactStyleRenderingEnabled)) {
                        d = d._getLastVisibleLeaf(d)
                    }
                    if (d.isColumn) {
                        this._colItemRangeSelectionEnd = d
                    } else {
                        this._rowItemRangeSelectionEnd = d
                    }
                } else {
                    this._pivotCells.hitTest(b, h);
                    if (h != null) {
                        this._colItemRangeSelectionEnd = h.pivotColumn;
                        this._rowItemRangeSelectionEnd = h.pivotRow
                    } else {
                        this._colItemRangeSelectionEnd = null;
                        this._rowItemRangeSelectionEnd = null
                    }
                }
            }
            if (this._internalSelectMode == "CELLS_SELECT") {
                var h = this._pivotCells._hitTest(this._selectStartPosition);
                this._colItemRangeSelectionBeg = h.pivotColumn;
                this._rowItemRangeSelectionBeg = h.pivotRow;
                if (!h) {
                    this._endSelectionUpdate();
                    this._internalRefresh();
                    return
                }
                if (g.x != b.x || g.y != b.y) {
                    this._pivotCells.hitTest(b, h);
                    this._colItemRangeSelectionEnd = h.pivotColumn;
                    this._rowItemRangeSelectionEnd = h.pivotRow
                }
                if (!h.pivotRow || !h.pivotColumn) {
                    this._internalSelectMode = "CELLS_SELECT";
                    this._pivotCells._internalSelectCell(this._rowItemRangeSelectionBeg, this._colItemRangeSelectionBeg);
                    this._cellKBRangeSelectionStart = this._cellKBRangeSelectionEnd = {
                        pivotRow: this._rowItemRangeSelectionBeg,
                        pivotColumn: this._colItemRangeSelectionBeg,
                        pivotCells: this._pivotCells
                    };
                    this._endSelectionUpdate();
                    this._internalRefresh();
                    return
                }
            }
            this._saveSelectedItemsRangeOrder();
            this._adjustSelectedItemsOrder(l);
            if (this._internalSelectMode == "CELLS_SELECT") {
                var u = this._pivotRows._getVisibleLeafLevelItems();
                var n = this._pivotColumns._getVisibleLeafLevelItems();
                var t = this._pivotRows._pointToLeafItemIndexAbsolute(this._selectStartPosition);
                var o = this._pivotRows._pointToLeafItemIndexAbsolute(b);
                var j = this._pivotColumns._pointToLeafItemIndexAbsolute(this._selectStartPosition);
                var f = this._pivotColumns._pointToLeafItemIndexAbsolute(b);
                if ((j == -1 && f == -1) || (t == -1 && o == -1)) {
                    this._endSelectionUpdate();
                    this._internalRefresh();
                    return
                }
                if (j == -1) {
                    j = f
                }
                if (f == -1) {
                    f = j
                }
                if (t == -1) {
                    t = o
                }
                if (o == -1) {
                    o = t
                }
                if (f < j) {
                    var s = j;
                    j = f;
                    f = s
                }
                if (o < t) {
                    var s = t;
                    t = o;
                    o = s
                }
                for (var m = t; m <= o && m < u.length; m++) {
                    var e = u[m];
                    for (var q = j; q <= f && q < n.length; q++) {
                        var k = n[q];
                        this._pivotCells._internalSelectCell(e, k)
                    }
                }
                this._cellKBRangeSelectionStart = {
                    pivotRow: this._rowItemRangeSelectionBeg,
                    pivotColumn: this._colItemRangeSelectionBeg,
                    pivotCells: this._pivotCells
                };
                this._cellKBRangeSelectionEnd = {
                    pivotRow: this._rowItemRangeSelectionEnd,
                    pivotColumn: this._colItemRangeSelectionEnd,
                    pivotCells: this._pivotCells
                };
                this._endSelectionUpdate();
                this._internalRefresh();
                return
            }
            this._restoreSelectedItemsRangeOrder();
            this._applyItemsMultiSelect(l);
            this._endSelectionUpdate();
            this._internalRefresh()
        },
        _saveSelectedItemsRangeOrder: function () {
            this._adjSelectedItemsSave.colBeg = this._colItemRangeSelectionBeg;
            this._adjSelectedItemsSave.colEnd = this._colItemRangeSelectionEnd;
            this._adjSelectedItemsSave.rowBeg = this._rowItemRangeSelectionBeg;
            this._adjSelectedItemsSave.rowEnd = this._rowItemRangeSelectionEnd
        },
        _restoreSelectedItemsRangeOrder: function () {
            this._colItemRangeSelectionBeg = this._adjSelectedItemsSave.colBeg;
            this._colItemRangeSelectionEnd = this._adjSelectedItemsSave.colEnd;
            this._rowItemRangeSelectionBeg = this._adjSelectedItemsSave.rowBeg;
            this._rowItemRangeSelectionEnd = this._adjSelectedItemsSave.rowEnd
        },
        _adjustSelectedItemsOrder: function (c) {
            if (this._colItemRangeSelectionBeg != null && this._colItemRangeSelectionEnd != null && this._colItemRangeSelectionBeg.x > this._colItemRangeSelectionEnd.x) {
                var b = this._colItemRangeSelectionBeg;
                this._colItemRangeSelectionBeg = this._colItemRangeSelectionEnd;
                this._colItemRangeSelectionEnd = b
            }
            if (this._rowItemRangeSelectionBeg != null && this._rowItemRangeSelectionEnd != null && this._rowItemRangeSelectionBeg.y > this._rowItemRangeSelectionEnd.y) {
                var b = this._rowItemRangeSelectionBeg;
                this._rowItemRangeSelectionBeg = this._rowItemRangeSelectionEnd;
                this._rowItemRangeSelectionEnd = b
            }
            if ((false == this.multipleSelectionEnabled && !c) || this._rowItemRangeSelectionEnd == null) {
                this._rowItemRangeSelectionEnd = this._rowItemRangeSelectionBeg
            }
            if ((false == this.multipleSelectionEnabled && !c) || this._colItemRangeSelectionEnd == null) {
                this._colItemRangeSelectionEnd = this._colItemRangeSelectionBeg
            }
        },
        _applyItemsMultiSelect: function (k) {
            this._saveSelectedItemsRangeOrder();
            this._adjustSelectedItemsOrder(k);
            for (var e = 0; e < 2; e++) {
                if (this._internalSelectMode == "COL_SELECT" && e != 0) {
                    continue
                }
                if (this._internalSelectMode == "ROW_SELECT" && e != 1) {
                    continue
                }
                var l = e == 0 ? this._colItemRangeSelectionBeg : this._rowItemRangeSelectionBeg;
                var c = e == 0 ? this._colItemRangeSelectionEnd : this._rowItemRangeSelectionEnd;
                var f = (e == 0) ? this._pivotColumns : this._pivotRows;
                var g = f._getVisibleLeafLevelItems();
                if (g == null) {
                    this._internalRefresh();
                    this._restoreSelectedItemsRangeOrder();
                    return
                }
                var b = false;
                for (var d in g) {
                    var m = g[d];
                    if (m != l && !b) {
                        continue
                    }
                    if (m.getWidthWithChildren() + m.x > this._mostRightItemBounds.x + this._mostRightItemBounds.width) {
                        this._mostRightItemBounds = {
                            x: m.x,
                            y: m.y,
                            width: m.getWidthWithChildren(),
                            height: m.getHeightWithChildren()
                        }
                    }
                    if (m.getWidthWithChildren() + m.x < this._mostLeftItemBounds.x + this._mostLeftItemBounds.width) {
                        this._mostLeftItemBounds = {
                            x: m.x,
                            y: m.y,
                            width: m.getWidthWithChildren(),
                            height: m.getHeightWithChildren()
                        }
                    }
                    b = true;
                    f._internalSelectItem(m);
                    if (m == c) {
                        break
                    }
                }
                if (f.isColumnsHierarchy || !f.compactStyleRenderingEnabled) {
                    f._applySelectionToParentItems()
                }
            }
            this._restoreSelectedItemsRangeOrder()
        },
        localizeStrings: function (g, e) {
            var b = this;
            if (a.jqx.dataFormat) {
                a.jqx.dataFormat.cleardatescache()
            }
            b._localizedStrings = {
                decimalseparator: ".",
                thousandsseparator: ",",
                sortascendingstring: "Sort Ascending",
                sortdescendingstring: "Sort Descending",
                sortremovestring: "Remove Sort",
                alignment: "Text alignment",
                cellalignment: "Number alignment",
                numberformat: "Number format",
                prefix: "Number prefix",
                decimalplacestext: "Decimal places",
                thousandsseparatortext: "Thousands separator",
                decimalseparatortext: "Decimal separator",
                nagativebracketstext: "Negatives in brackets",
                fieldsettings: "Field settings",
                ok: "Ok",
                cancel: "Cancel"
            };
            var c = a.extend({}, g);
            b._localizedStrings = a.extend(b._localizedStrings, c);
            for (var f in c) {
                if (f && f.toLowerCase() !== f) {
                    c[f.toLowerCase()] = c[f]
                }
            }
            for (var d in b._localizedStrings) {
                if (c[d] !== undefined) {
                    b._localizedStrings[d] = c[d]
                }
            }
        },
    })
})(jqxBaseFramework);
$.jqx.jqxPivotGrid = $.jqx.jqxPivotGrid || {};
$.jqx.define($.jqx.jqxPivotGrid, "propertyBag", "");
$.extend($.jqx.jqxPivotGrid.propertyBag.prototype, {
    defineInstance: function () {
        this.namedPropertyTables = {};
        this._tableSizes = {};
        this.enablePropertyChangeNotifications = false
    },
    getPropertyTable: function (a) {
        if (undefined == this.namedPropertyTables[a]) {
            this.namedPropertyTables[a] = {};
            this._tableSizes[a] = 0
        }
        return this.namedPropertyTables[a]
    },
    getPropertyCount: function (a) {
        var b = this.getPropertyTable(a);
        if (null == b) {
            return 0
        }
        return this._tableSizes[a]
    },
    getPropertyValue: function (a, b) {
        var c = this.getPropertyTable(a);
        if (null == c) {
            return null
        }
        if (c[b] != undefined) {
            return c[b]
        }
        return null
    },
    containsPropertyValue: function (a, b) {
        var c = this.getPropertyTable(a);
        if (null == c) {
            return false
        }
        return c[b] != undefined
    },
    removePropertyValue: function (a, b) {
        var c = this.getPropertyTable(a);
        if (null == c) {
            return
        }
        delete c[b];
        this._tableSizes[a]--
    },
    setPropertyValue: function (a, b, c) {
        var d = this.getPropertyTable(a);
        if (null == d) {
            return
        }
        if (c == null || c == undefined) {
            if (d[b]) {
                this._tableSizes[a]--;
                delete d[b]
            }
        } else {
            if (!d[b]) {
                this._tableSizes[a]++
            }
            d[b] = c
        }
        if (this.enablePropertyChangeNotifications) {
            this.onPropertyChanged(a)
        }
    },
    clear: function (a) {
        if (a == "" || a == null || a == undefined) {
            this.namedPropertyTables = {};
            return
        }
        var b = this.getPropertyTable(a);
        b = {};
        this._tableSizes[a] = 0
    },
    onPropertyChanged: function (a) {
        $.event.trigger("propertychanged", a)
    }
});
(function (a) {
    a.jqx.jqxPivotGrid = a.jqx.jqxPivotGrid || {};
    a.jqx.define(a.jqx.jqxPivotGrid, "pivotCells", "");
    a.extend(a.jqx.jqxPivotGrid.pivotCells.prototype, {
        defineInstance: function () {
            this.parentPivotGrid = null;
            this.IsDataBoundPivotCellsEditable = false;
            this.cellProperties = new a.jqx.jqxPivotGrid.propertyBag();
            this.hashCellAutoSize = {};
            this.hashCellInSpan = {};
            this.hashCellSpan = {};
            this._selectedCells = new Object()
        },
        hitTest: function (c) {
            var d = this._hitTest(c);
            if (!d) {
                return undefined
            }
            var b = {
                pivotRow: d.pivotRow,
                pivotColumn: d.pivotColumn,
                pivotCells: this
            };
            return b
        },
        _hitTest: function (b) {
            var c = {};
            c.pivotColumn = this.parentPivotGrid._pivotColumns._pointToLeafItemAbsolute(b);
            c.pivotRow = this.parentPivotGrid._pivotRows._pointToLeafItemAbsolute(b);
            if (this.parentPivotGrid._pivotColumns.isGroupingColumn(c.pivotColumn)) {
                return undefined
            }
            if (c.pivotColumn == null || c.pivotRow == null) {
                return undefined
            }
            return c
        },
        clear: function () {
            this._reset()
        },
        _reset: function () {
            this.cellProperties.clear();
            this._selectedCells = new Object();
            this.hashCellAutoSize = {};
            this.hashCellInSpan = {};
            this.hashCellSpan = {};
            this._clearElementsAndCellsCache()
        },
        _resetCanvas: function () {
            var b = a.jqx.get(this, "renderCanvas");
            if (!b) {
                return
            }
            while (b.hasChildNodes()) {
                b.removeChild(b.firstChild)
            }
        },
        _clearElementsAndCellsCache: function () {
            this._clearCellsCache()
        },
        setCellValue: function (b, g, k) {
            if (b == null || g == null) {
                return
            }
            var c = this.parentPivotGrid.getCellId(g, b);
            var i = this.getCellDataSource(b, g);
            var f = b.BoundFieldIndex != -1 && g.BoundFieldIndex != -1;
            var d = false;
            var j = this.getCellDataSource(b, g);
            if (j == "DataBound" && f) {
                d = this.parentPivotGrid.OnCellValueChanging(b, g, k);
                if (d) {
                    return
                }
                try {
                    this.parentPivotGrid.setCellValueFromDataSourceNonPivot(b, g, k)
                } catch (h) {
                    return
                }
                this.cellProperties.setPropertyValue("CellValue", c, null);
                this.parentPivotGrid.OnCellValueChanged(b, g);
                return
            } else {
                if (j == "DataBoundPivot") {
                    if (!this.IsDataBoundPivotCellsEditable) {
                        throw "The cell's value is derived from the data source and aggregated. It is not editable in this mode. Use the SetCellDataSource method to change the cell's data source first"
                    } else {
                        return
                    }
                }
            }
            var d = this.parentPivotGrid.OnCellValueChanging(b, g, k);
            if (d) {
                return
            }
            this.SetCellDataSource(b, g, "Static");
            this.cellProperties.setPropertyValue("CellValue", c, k);
            this.onPropertyChanged("CellValue");
            this.parentPivotGrid.OnCellValueChanged(b, g)
        },
        _clearCellsCache: function () {
            this.cellProperties.clear("CellValue")
        },
        _clearCachedCell: function (d, c) {
            var b = this.parentPivotGrid.getCellId(c, d);
            if (this.cellProperties.containsPropertyValue("CellValue", b)) {
                this.cellProperties.removePropertyValue("CellValue", b)
            }
        },
        drillThroughCell: function (c, b) {
            if (!c || c.isColumn) {
                throw "Invalid pivotRow parameter"
            }
            if (!b || !b.isColumn) {
                throw "Invalid pivotColumn parameter"
            }
            return this.parentPivotGrid.source.drillThroughPivotCell(c.adapterItem, b.adapterItem)
        },
        getCellValue: function (h, f) {
            var d = null;
            if (this.parentPivotGrid._pivotColumns.isGroupingColumn(f)) {
                return null
            }
            var c = this.parentPivotGrid.getCellId(f, h);
            var b = this.getCellDataSource(h, f);
            if (h.isTotal || f.isTotal) {
                b = "Virtual"
            }
            switch (b) {
                case "Virtual":
                    d = this.parentPivotGrid.onCellValueNeeded(h, f);
                    this.cellProperties.setDirty(c);
                    if (d == null && this.parentPivotGrid.bindingState == "BoundPivot" && (h.isTotal || f.isTotal)) {
                        d = this.parentPivotGrid.getCellValueFromDataSource(h, f)
                    }
                    break;
                case "DataBoundPivot":
                    d = this.cellProperties.getPropertyValue("CellValue", c);
                    if (d == null) {
                        d = this.parentPivotGrid.source.getCellValue(h.adapterItem, f.adapterItem);
                        if (this.cellProperties.getPropertyCount("CellValue") < 4000000) {
                            this.cellProperties.setPropertyValue("CellValue", c, d)
                        }
                    }
                    break;
                case "DataBound":
                    d = this.cellProperties.getPropertyValue("CellValue", c);
                    if (d == null) {
                        try {
                            d = this.parentPivotGrid.getCellValueFromDataSourceNonPivot(h, f)
                        } catch (g) {
                            return null
                        }
                        if (this.cellProperties.getPropertyCount("CellValue") < 4000000) {
                            this.cellProperties.setPropertyValue("CellValue", c, d)
                        }
                    }
                    break;
                case "NotSet":
                case "Static":
                default:
                    d = this.cellProperties.getPropertyValue("CellValue", c);
                    break
            }
            return d
        },
        setCellDataSource: function (e, c, b) {
            if (e == null || c == null) {
                return
            }
            var d = this.parentPivotGrid.getCellId(c, e);
            this.cellProperties.setPropertyValue("cellDataSource", d, b)
        },
        getCellDataSource: function (e, b) {
            var d = this.parentPivotGrid.getCellId(b, e);
            var c = this.cellProperties.getPropertyValue("cellDataSource", d);
            if (null == c) {
                c = b.cellDataSource
            }
            if (c == null || c == "NotSet") {
                c = e.cellDataSource
            }
            if (c != null && c != "NotSet") {
                return c
            }
            if (this.parentPivotGrid.UseVirtualCellsByDefault) {
                return "Virtual"
            }
            if (this.parentPivotGrid.bindingState == "DataBound" || this.parentPivotGrid.bindingState == "DataBoundPivot") {
                return this.parentPivotGrid.bindingState
            }
            return "NotSet"
        },
        render: function () {
            var m = this.renderCanvas;
            if (!m) {
                return
            }
            var x = this.parentPivotGrid;
            x.setElementPosition(m, -this.parentPivotGrid._offsetX, -this.parentPivotGrid._offsetY);
            var d = x._pivotRows;
            var A = x._pivotColumns;
            if (!this._refreshRequired && (!d._isVirtualMode && !A._isVirtualMode)) {
                return
            }
            var o = d._getLeafItemsToRender();
            var g = A._getLeafItemsToRender();
            this._cellElements = this._cellElements || {};
            var e = new Array();
            var q = new Date();
            var s = {
                first: d._isVirtualMode ? o.first : 0,
                last: d._isVirtualMode ? o.last : o.items.length - 1
            };
            var u = {
                first: A._isVirtualMode ? g.first : 0,
                last: A._isVirtualMode ? g.last : g.items.length - 1
            };
            for (var y = s.last; y >= s.first; y--) {
                for (var G = u.last; G >= u.first; G--) {
                    if (y == -1 || G == -1) {
                        continue
                    }
                    var n = o.items[y];
                    var l = g.items[G];
                    var I = x.getCellId(l, n);
                    var p = l.getDisplayWidth() - 1;
                    var F = n.getDisplayHeight() - 1;
                    var f = this.isCellSelected(n, l);
                    var z = this._cellElements[I];
                    var k = undefined;
                    if (z && z.isSelected == f) {
                        k = z.element
                    }
                    var v = {
                        left: 4,
                        top: 4,
                        right: 4,
                        bottom: 4
                    };
                    var B = this.getCellValue(n, l);
                    var j = "";
                    if (!k) {
                        k = x.createDiv(m, j, p, F);
                        k.cellId = I;
                        this._cellElements[I] = {
                            element: k,
                            isSelected: f
                        };
                        x.setElementSize(k, p, F);
                        var D = "right";
                        if (x.cellsRenderer && a.isFunction(x.cellsRenderer)) {
                            j = x.cellsRenderer({
                                value: B.value,
                                formattedValue: B.formattedValue,
                                isSelected: f,
                                pivotRow: n,
                                pivotColumn: l
                            });
                            v = {
                                left: 0,
                                top: 0,
                                right: 0,
                                bottom: 0
                            }
                        } else {
                            j = (B !== undefined && B.formattedValue !== undefined) ? B.formattedValue.toString() : "";
                            var C = this.parentPivotGrid.source.getCellFormatSettings(n.adapterItem, l.adapterItem);
                            if (C) {
                                D = C.align || "right"
                            }
                        }
                        this.parentPivotGrid.setDivContent(k, j, v, D);
                        k.originalY = k.style.top;
                        k.className = this.parentPivotGrid.toThemeProperty("jqx-grid-cell-normal")
                    } else {
                        if (k.style.width != p + "px" || k.style.height != F + "px") {
                            this.parentPivotGrid.setElementSize(k, p, F)
                        }
                    }
                    k.tRender = q;
                    if (k.style.display != "block") {
                        k.style.display = "block"
                    }
                    if (k.style.left != l.x + "px" || k.style.top != n.y + "px") {
                        this.parentPivotGrid.setElementPosition(k, l.x, n.y)
                    }
                    var b = "cellsClassName";
                    if (this.isCellSelected(n, l)) {
                        k.className = this.parentPivotGrid.toThemeProperty("jqx-grid-cell-selected jqx-fill-state-hover jqx-widget-content");
                        b = "cellsClassNameSelected"
                    } else {
                        k.className = this.parentPivotGrid.toThemeProperty("jqx-grid-cell-normal jqx-widget-content")
                    }
                    var H = a.jqx.getByPriority([n[b], (n.adapterItem && n.adapterItem.boundField) ? n.adapterItem.boundField[b] : undefined, l[b], (l.adapterItem && l.adapterItem.boundField) ? l.adapterItem.boundField[b] : undefined]);
                    if (H) {
                        k.className += " " + H
                    }
                    k.className += " jqx-pivotgrid-content-wrapper"
                }
            }
            for (var E = 0; E < m.childNodes.length; E++) {
                if (m.childNodes[E].cellId && m.childNodes[E].tRender != q) {
                    e.push(m.childNodes[E])
                }
            }
            while (true) {
                var k = e.pop();
                if (!k) {
                    break
                } else {
                    delete this._cellElements[k.cellId];
                    k.style.display = "none";
                    m.removeChild(k)
                }
            }
            this._refreshRequired = false
        },
        _beginSelectionUpdate: function () {
            for (var b in this._selectedCells) {
                this._selectedCells[b].OldIsSelected = this._selectedCells[b].isSelected
            }
        },
        _endSelectionUpdate: function () {
            var d = new Array();
            for (var b in this._selectedCells) {
                var c = this._selectedCells[b];
                if (!c.isSelected) {
                    d.push(b)
                }
                if (c.isSelected != c.OldIsSelected) {}
            }
            if (d.length > 0) {
                for (var b in d) {
                    delete this._selectedCells[d[b]]
                }
            }
        },
        _internalClearSelection: function () {
            for (var b in this._selectedCells) {
                this._internalUnselectCell(this._selectedCells[b].pivotRow, this._selectedCells[b].pivotColumn)
            }
        },
        clearSelection: function () {
            this._beginSelectionUpdate();
            this._internalClearSelection();
            this._endSelectionUpdate();
            this.render()
        },
        selectCell: function (c, b) {
            if (!this.parentPivotGrid.selectionEnabled) {
                return
            }
            this._beginSelectionUpdate();
            this._internalSelectCell(c, b);
            this.parentPivotGrid._cellKBRangeSelectionStart = {
                pivotRow: c,
                pivotColumn: b,
                pivotCells: this
            };
            this.parentPivotGrid._cellKBRangeSelectionEnd = {
                pivotRow: c,
                pivotColumn: b,
                pivotCells: this
            };
            this._endSelectionUpdate()
        },
        _internalSelectCell: function (d, c) {
            if (c != null && this.parentPivotGrid._pivotColumns.isGroupingColumn(c)) {
                return
            }
            if (this.parentPivotGrid._internalSelectMode == "NO_SELECT") {
                switch (this.parentPivotGrid.selectionMode) {
                    case "CELL_SELECT":
                        this.parentPivotGrid._internalSelectMode = "CELLS_SELECT";
                        break;
                    case "FULL_COLUMN_SELECT":
                        this.parentPivotGrid._internalSelectMode = "COL_SELECT";
                        break;
                    case "FULL_ROW_SELECT":
                        this.parentPivotGrid._internalSelectMode = "ROW_SELECT";
                        break
                }
            }
            var b = this.parentPivotGrid.getCellId(c, d);
            delete this._cellElements[b];
            if (this._selectedCells[b] == undefined) {
                this._selectedCells[b] = {
                    pivotRow: d,
                    pivotColumn: c,
                    isSelected: true
                }
            } else {
                this._selectedCells[b].isSelected = true
            }
            this._refreshRequired = true
        },
        unselectCell: function (c, b) {
            this._beginSelectionUpdate();
            this._internalUnselectCell(c, b);
            this._endSelectionUpdate()
        },
        _internalUnselectCell: function (d, c) {
            var b = this.parentPivotGrid.getCellId(c, d);
            if (this._selectedCells[b] != undefined) {
                this._selectedCells[b].isSelected = false
            }
            delete this._cellElements[b];
            this._refreshRequired = true
        },
        isCellSelected: function (d, c) {
            var b = this.parentPivotGrid.getCellId(c, d);
            if (c.isSelected || d.isSelected) {
                return true
            }
            return this._selectedCells[b] != undefined && this._selectedCells[b].isSelected
        },
        getSelectedCellsCount: function () {
            return this._selectedCells.length
        },
        getSelectedCells: function () {
            var d = new Array();
            for (var c in this._selectedCells) {
                var b = this._selectedCells[c];
                if (b.isSelected) {
                    d.push({
                        pivotRow: b.pivotRow,
                        pivotColumn: b.pivotColumn,
                        pivotCells: this
                    })
                }
            }
            return d
        },
        getNextCell: function (c, b) {
            var e = {};
            switch (b) {
                case "left":
                    e = {
                        x: c.pivotColumn.x - 1,
                        y: c.pivotRow.y + 1
                    };
                    break;
                case "right":
                    e = {
                        x: c.pivotColumn.x + c.pivotColumn.getWidth() + 1,
                        y: c.pivotRow.y + 1
                    };
                    break;
                case "top":
                    e = {
                        x: c.pivotColumn.x + 1,
                        y: c.pivotRow.y - 1
                    };
                    break;
                case "bottom":
                    e = {
                        x: c.pivotColumn.x + 1,
                        y: c.pivotRow.y + c.pivotRow.getHeight() + 1
                    };
                    break
            }
            var f = {
                x: e.x + 2 * this.parentPivotGrid._pivotColumns.x - this.parentPivotGrid._pivotColumns.viewPort.x,
                y: e.y + 2 * this.parentPivotGrid._pivotRows.y - this.parentPivotGrid._pivotRows.viewPort.y
            };
            var d = this._hitTest(f);
            if (!d) {
                return undefined
            }
            return d
        }
    })
})(jqxBaseFramework);
(function (a) {
    a.jqx.jqxPivotGrid = a.jqx.jqxPivotGrid || {};
    a.jqx.jqxPivotGrid.pivotItem = function (c, b) {
        this.text = "Item";
        this.isExpanded = false;
        this.expandCollapseEnabled = true;
        this.isHidden = false;
        this.isFiltered = false;
        this.isSelected = false;
        this._height = 26;
        this._width = 18;
        this.isDirty = true;
        this.parentItem = c || null;
        this.hierarchy = b || c.hierarchy;
        this.parentPivotGrid = this.hierarchy.parentPivotGrid;
        this.id = this.parentPivotGrid.genId();
        this.itemLevel = 0;
        this.itemColumn = 0;
        this._itemOrdinal = NaN;
        this.x = 0;
        this.y = 0;
        this.hierarchyItemWidth = 70;
        this.hierarchyItemHeight = 26;
        this.widthWithChildrenCached = 0;
        this.minimumWidth = 18;
        this.maximumWidth = 10000000;
        this.minimumHeight = 8;
        this.maximumHeight = Infinity;
        this.items = new Array();
        this.valueItems = new Array()
    };
    a.extend(a.jqx.jqxPivotGrid.pivotItem.prototype, {
        _getChildItemsToRender: function (d) {
            for (var b = 0; b < this.items.length; b++) {
                var c = this.items[b];
                if (c.isHidden || c.isFiltered) {
                    continue
                }
                d.push(c);
                if (c.isExpanded) {
                    c._getChildItemsToRender(d)
                }
            }
        },
        _calculateWidthWithChildren: function () {
            if (this.isHidden) {
                this.widthWithChildrenCached = 0;
                return
            }
            var d = (!this.isColumn && this.hierarchy.compactStyleRenderingEnabled);
            if (d) {
                this.widthWithChildrenCached = this.hierarchy.getColumnWidth(0);
                return
            }
            this.widthWithChildrenCached = this.getWidth();
            if (this.items != null && this.valueItems != null) {
                if (this.getVisibleItemsCount() > 0 || (!this.isColumn && !d)) {
                    var c = 0;
                    if (!this.isColumn) {
                        var b = this.hierarchy.getMaxVisibleLevelDepth();
                        for (var e = this.itemLevel; e <= b; e++) {
                            c += this.hierarchy.getColumnWidth(e)
                        }
                    } else {
                        c = 0;
                        if (this.isExpanded) {
                            for (var e = 0; e < this.items.length; e++) {
                                if ((this.items[e]).isHidden) {
                                    continue
                                }
                                c += this.items[e].getWidthWithChildren()
                            }
                        }
                        for (var e = 0; e < this.valueItems.length; e++) {
                            if (this.valueItems[e].isHidden) {
                                continue
                            }
                            c += this.valueItems[e].getWidthWithChildren()
                        }
                    }
                    this.widthWithChildrenCached = c;
                    return
                }
            }
            this.widthWithChildrenCached = this.getWidth();
            return
        },
        getWidthWithChildren: function () {
            if (this.hierarchy._renderRequired) {
                this._calculateWidthWithChildren()
            }
            return this.widthWithChildrenCached
        },
        getDisplayWidth: function () {
            if (!this.isDirty && !this.hierarchy._renderRequired) {
                return this.displayWidth
            }
            var b = this.hasVisibleValueItems();
            if (this.isColumn) {
                this.displayWidth = (this.isExpanded || b) ? this.getWidthWithChildren() : this.getWidth()
            } else {
                this.displayWidth = (!this.hierarchy.isColumnsHierarchy && this.hierarchy.compactStyleRenderingEnabled) ? this.getWidthWithChildren() : this.getWidth();
                if (!this.isExpanded && !b) {
                    this.displayWidth = this.hierarchy.getWidth() - this.x
                }
            }
            if (this.displayWidth < 18) {
                this.displayWidth = 18
            }
            return this.displayWidth
        },
        getWidth: function () {
            if (this.isHidden || this.isFiltered) {
                return 0
            }
            if (null == this.hierarchy) {
                return 0
            }
            var d = this.itemColumn;
            if (!this.hierarchy.isColumnsHierarchy && this.hierarchy.compactStyleRenderingEnabled) {
                d = 0
            }
            var c = this.minimumWidth;
            if (!this.isColumn) {
                c = this.hierarchy.getColumnWidth(d)
            } else {
                c = this.hierarchyItemWidth;
                if (this.parentItem) {
                    var b = this.parentItem.getWidth();
                    if (b > c && b > this.parentItem.widthWithChildrenCached) {}
                }
            }
            return c
        },
        escape_HTML: function (b) {
            return b.replace(/[&<>"]/g, function (d) {
                var c = {
                    "&": "&",
                    "<": "<",
                    ">": ">",
                    '"': '"'
                };
                return c[d] || d
            })
        },
        _measureElement: function (f) {
            f = this.escape_HTML("" + f);
            var c = a("<span style='visibility: hidden; white-space: nowrap;'>" + f + "</span>");
            a(document.body).append(c);
            var d = this.hierarchy.sortable ? 16 : 0;
            var e = 4;
            var b = {
                width: c.width() + d + 2 * e,
                height: c.height() + 2 * e
            };
            c.remove();
            return b
        },
        autoResize: function (b) {
            if (!b) {
                b = "fitItemContent"
            }
            if (this.isColumn) {
                this.setWidth(this.minimumWidth)
            } else {
                this.setHeight(this.minimumHeight)
            }
            if (b == "default" || b == "fitAll" || b == "fitItemContent") {
                this._autoResizeBestItemContent(b)
            }
            if (b == "default" || b == "fitAll" || b == "fitItemContent") {
                if (this.isColumn && this.parentItem != null && this.getWidth() < this.parentItem.getWidth()) {
                    this.setWidth(this.parentItem.getWidth())
                }
            }
        },
        _autoResizeBestItemContent: function (b) {
            this._updateVisibleChildItemsCount();
            var e = this._measureElement(this.text);
            if (b == "default" && this.adapterItem.boundField) {
                if (!isNaN(this.adapterItem.boundField.width)) {
                    e.width = this.adapterItem.boundField.width
                }
                if (!isNaN(this.adapterItem.boundField.height)) {
                    e.height = this.adapterItem.boundField.height
                }
            }
            if (this.itemColumn >= this.hierarchy._getColumnsCount()) {
                this.hierarchy._updateColumnsCount()
            }
            if (this._visibleChildItemsCount > 0) {
                e.width += 30
            }
            if (this.getWidth() < e.width || (b == "default" && this.adapterItem.boundField && !isNaN(this.adapterItem.boundField.width))) {
                this.setWidth(e.width)
            }
            if (!this.isColumn) {
                if (this.getHeight() < e.height) {
                    this.setHeight(e.height)
                }
            } else {
                var d = this.parentPivotGrid._pivotColumns.getHeight();
                if (d < e.height) {
                    this.parentPivotGrid._pivotColumns.setRowHeight(this, e.height)
                }
            }
            for (var c in this.items) {
                this.items[c]._autoResizeBestItemContent(b)
            }
            for (var c in this.valueItems) {
                this.valueItems[c]._autoResizeBestItemContent(b)
            }
            if (this.hierarchy != null) {
                this.hierarchy._renderRequired = true
            }
        },
        _autoResizeBestCellFit: function (d) {
            if (this.hierarchy != null && this.hierarchy._renderRequired) {
                this.hierarchy.render()
            }
            if (this.hierarchy != null && this.hierarchy.ColumnsCountRequresUpdate) {
                this.hierarchy._updateColumnsCount()
            }
            if (this.items.length == 0 && this.valueItems.length == 0) {
                if (this.hierarchy != null && this.parentPivotGrid != null && this.parentPivotGrid._pivotCells != null && this.parentPivotGrid._pivotRows != null && this.parentPivotGrid._pivotColumns != null) {
                    var c = {
                        width: 1,
                        height: 1
                    };
                    var e = this.isColumn ? this.parentPivotGrid._pivotRows : this.parentPivotGrid._pivotColumns;
                    var g = this._getVisibleLeafLevelItems();
                    for (var f in g) {
                        var i = !(g[f].isColumn) ? g[f] : this;
                        var b = g[f].isColumn ? g[f] : this;
                        var h = {
                            width: 10,
                            height: 10
                        };
                        if (c.width < h.width) {
                            c.width = h.width
                        }
                        if (c.height < h.height) {
                            c.height = h.height
                        }
                    }
                    if (this.width < c.width) {
                        this.setWidth(c.width)
                    }
                    if (!this.isColumn && this.getHeight() < c.height) {
                        this.setHeight(c.height)
                    }
                }
            } else {
                for (var f in this.items) {
                    this.items[f]._autoResizeBestCellFit(d)
                }
                for (var f in this.valueItems) {
                    this.valueItems[f]._autoResizeBestCellFit(d)
                }
            }
            if (this.hierarchy != null) {
                this.hierarchy._renderRequired = true
            }
        },
        setWidth: function (c) {
            if (c < 0) {
                throw new Exception("Invalid pivotItem Width value. The value must greater than 0")
            }
            if (null == this.hierarchy) {
                return
            }
            var b = this.itemColumn;
            if (!this.hierarchy.isColumnsHierarchy && this.hierarchy.compactStyleRenderingEnabled) {
                b = 0
            }
            if (this.hierarchy._getColumnsCount() < b) {
                this.hierarchy._updateColumnsCount()
            }
            if (c < this.minimumWidth) {
                c = this.minimumWidth
            }
            if (c > this.maximumWidth) {
                c = this.maximumWidth
            }
            if (this.isColumn) {
                this.hierarchyItemWidth = c
            } else {
                this.hierarchy.setColumnWidth(b, c)
            }
            this.hierarchy._renderRequired = true
        },
        getHeight: function () {
            if (this.isHidden || this.isFiltered) {
                return 0
            }
            return this.hierarchyItemHeight
        },
        setHeight: function (b) {
            if (b < 0 || b > 10000) {
                throw new Exception("Invalid pivotItem Height value. The value must be between 0 and 10000")
            }
            if (b < this.minimumHeight) {
                b = this.minimumHeight
            }
            if (b > this.maximumHeight) {
                b = this.maximumHeight
            }
            this.hierarchyItemHeight = b;
            if (this.hierarchy != null) {
                this.hierarchy._renderRequired = true
            }
        },
        _calculateHeightWithChildren: function () {
            if (this.isHidden || this.isFiltered) {
                this.heightWithChildren = 0;
                return
            }
            var c = (!this.isColumn && this.hierarchy.compactStyleRenderingEnabled);
            if (this.isExpanded || this.hasVisibleValueItems()) {
                var b = 0;
                if (this.isColumn) {
                    b = this.hierarchyItemHeight;
                    var f = 0;
                    if (this.isExpanded) {
                        for (var d = 0; d < this.items.length; d++) {
                            var e = this.items[d].getHeightWithChildren();
                            if (f < e) {
                                f = e
                            }
                        }
                    }
                    for (var d = 0; d < this.valueItems.length; d++) {
                        var e = this.valueItems[d].getHeightWithChildren();
                        if (f < e) {
                            f = e
                        }
                    }
                    if (f > 0) {
                        b += f
                    }
                } else {
                    b = c ? this.getHeight() : 0;
                    if (this.isExpanded) {
                        for (var d = 0; d < this.items.length; d++) {
                            if (this.items[d].isHidden || this.items[d].isFiltered) {
                                continue
                            }
                            b += this.items[d].getHeightWithChildren()
                        }
                    }
                    for (var d = 0; d < this.valueItems.length; d++) {
                        if (this.valueItems[d].isHidden || this.valueItems[d].isFiltered) {
                            continue
                        }
                        b += this.valueItems[d].getHeightWithChildren()
                    }
                }
                this.heightWithChildren = b
            } else {
                this.heightWithChildren = this.hierarchyItemHeight
            }
            if (this.IsRowDetailsVisible) {
                this.heightWithChildren += this.RowDetailsHeight
            }
            return
        },
        getHeightWithChildren: function () {
            if (this.hierarchy._renderRequired || this.isDirty) {
                this._calculateHeightWithChildren()
            }
            return this.heightWithChildren
        },
        getDisplayHeight: function () {
            var c = this.hasVisibleValueItems();
            var b = 0;
            if (this.isColumn) {
                b = (this.isExpanded || c) ? this.getTotalHeight() : this.hierarchy.getHeight() - this.y
            } else {
                if (this.hierarchy.compactStyleRenderingEnabled) {
                    b = this.getHeight();
                    if (this.IsRowDetailsVisible) {
                        b += this.RowDetailsHeight
                    }
                } else {
                    b = this.getHeightWithChildren()
                }
            }
            if (b < this.minimumHeight) {
                b = this.minimumHeight
            }
            return b
        },
        getTotalHeight: function () {
            if (this.isHidden || this.isFiltered) {
                return 0
            }
            return this.hierarchyItemHeight + ((this.IsRowDetailsVisible) ? this.RowDetailsHeight : 0)
        },
        ensureVisible: function () {
            var c = this;
            if (c.isVisible()) {
                return
            }
            var e = c.hierarchy.parentPivotGrid.host;
            if (c.isColumn) {
                var b = e.find("#divHScroll");
                if (c.x + c.getWidth() > c.hierarchy.viewPort.width) {
                    b.val(c.x + c.getWidth() - c.hierarchy.viewPort.width)
                } else {
                    b.val(c.x)
                }
            } else {
                var d = e.find("#divVScroll");
                if (c.y + c.getHeight() > c.hierarchy.viewPort.height) {
                    d.val(c.y + c.getHeight() - c.hierarchy.viewPort.height)
                } else {
                    d.val(c.y)
                }
            }
        },
        isVisible: function () {
            if (this.isHidden) {
                return false
            }
            if (this.y < this.hierarchy.viewPort.y - this.hierarchy.y || this.y + this.getDisplayHeight() > this.hierarchy.viewPort.y - this.hierarchy.y + this.hierarchy.viewPort.height || this.x < this.hierarchy.viewPort.x - this.hierarchy.x || this.x + this.getDisplayWidth() > this.hierarchy.viewPort.x - this.hierarchy.x + this.hierarchy.viewPort.width) {
                return false
            }
            return true
        },
        _updateVisibleChildItemsCount: function () {
            var c = 0;
            for (var b = 0; b < this.items.length; b++) {
                if (this.items[b].isHidden || this.items[b].isFiltered) {
                    continue
                }
                c++
            }
            this._visibleChildItemsCount = c
        },
        render: function (h, g) {
            this._updateVisibleChildItemsCount();
            var k = -1;
            var b = -1;
            if (this.isHidden || this.isFiltered) {
                return true
            }
            this.x = h;
            this.y = g;
            var c = (!this.isColumn && this.hierarchy.compactStyleRenderingEnabled);
            var d = c ? this.getTotalHeight() : 0;
            if (this.isExpanded) {
                for (var e = 0; e < this.items.length; e++) {
                    var j = this.items[e];
                    if (j.isHidden || j.isFiltered) {
                        continue
                    }
                    if (!this.isColumn) {
                        var f = h;
                        f += c ? 0 : this.getWidth();
                        if (!j.render(f, this.y + d)) {
                            break
                        }
                        d += j.getHeightWithChildren()
                    } else {
                        if (!j.render(this.x + d, g + this.getTotalHeight())) {
                            break
                        }
                        d += j.getWidthWithChildren()
                    }
                }
            }
            for (var e = 0; e < this.valueItems.length; e++) {
                var j = this.valueItems[e];
                if (j.isHidden || j.isFiltered) {
                    continue
                }
                if (!this.isColumn) {
                    var f = h;
                    f += c ? 0 : this.getWidth();
                    if (!j.render(f, this.y + d)) {
                        break
                    }
                    d += j.getHeightWithChildren()
                } else {
                    if (!j.render(this.x + d, g + this.getTotalHeight())) {
                        break
                    }
                    d += j.getWidthWithChildren()
                }
            }
            this._calculateWidthWithChildren();
            this._calculateHeightWithChildren();
            return true
        },
        _getChildItemsDepth: function () {
            var d = 0;
            for (var c = 0; c < this.items.length; c++) {
                var b = this.items[c]._getChildItemsDepth();
                if (b > d) {
                    d = b
                }
            }
            for (var c = 0; c < this.valueItems.length; c++) {
                var b = this.valueItems[c]._getChildItemsDepth();
                if (b > d) {
                    d = b
                }
            }
            return d + 1
        },
        getTotalItemsCount: function () {
            var c = 0;
            if (this.items.length == 0 && this.valueItems.length == 0) {
                c = 1
            } else {
                for (var b = 0; b < this.items.length; b++) {
                    c += this.items[b].getTotalItemsCount()
                }
                for (var b = 0; b < this.valueItems.length; b++) {
                    c += this.valueItems[b].getTotalItemsCount()
                }
            }
            return c
        },
        hasVisibleValueItems: function () {
            for (var b = 0; b < this.valueItems.length; b++) {
                var c = this.valueItems[b];
                if (false == c.isHidden && false == c.isFiltered) {
                    return true
                }
            }
            return false
        },
        getVisibleItemsCount: function () {
            if (this.isHidden || this.isFiltered) {
                return 0
            }
            var c = 0;
            if ((!this.isExpanded || this.items.length == 0) && this.valueItems.length == 0) {
                return c
            } else {
                c = 0;
                for (var b = 0; b < this.items.length; b++) {
                    if (!this.items[b].isHidden && !this.items[b].isFiltered) {
                        c++
                    }
                }
                for (var b = 0; b < this.valueItems.length; b++) {
                    if (!this.valueItems[b].isHidden && !this.valueItems[b].isFiltered) {
                        c++
                    }
                }
            }
            return c
        },
        hitTest: function (b) {
            if (this.isHidden || this.isFiltered) {
                return null
            }
            var d = this.getDisplayHeight() + 1;
            var c = this.getDisplayWidth() + 1;
            if (b.x >= this.x && b.x <= this.x + c && b.y >= this.y && b.y <= this.y + d) {
                return this
            }
            return null
        },
        _expandInternal: function (b, f, g) {
            if (this.items.length == 0) {
                return
            }
            if (!this.expandCollapseEnabled) {
                return
            }
            if (this.isExpanded == b) {
                return
            }
            var e = new a.Event(this.isExpanded ? "pivotitemcollapsing" : "pivotitemexpanding");
            e.owner = this.hierarchy.parentPivotGrid;
            e.args = {
                pivotItem: this
            };
            e.cancel = false;
            var d = this.hierarchy.parentPivotGrid.host;
            d.trigger(e);
            if (e.cancel) {
                return
            }
            this.isExpanded = b;
            if (this.items.length == 0 && this.valueItems.length == 0) {
                return
            }
            if (g) {
                for (var c = 0; c < this.items.length; c++) {
                    this.items[c]._expandInternal(b, f, g)
                }
                for (var c = 0; c < this.valueItems.length; c++) {
                    this.valueItems[c]._expandInternal(b, f, g)
                }
            }
            this.hierarchy._renderRequired = true;
            if (f) {
                this.hierarchy._updateVisibleLeaves()
            }
            var e = new a.Event(this.isExpanded ? "pivotitemexpanded" : "pivotitemcollapsed");
            e.owner = this.hierarchy.parentPivotGrid;
            e.args = {
                pivotItem: this
            };
            d.trigger(e)
        },
        expand: function () {
            this._expandInternal(true, true, false)
        },
        collapse: function () {
            this._expandInternal(false, true, false)
        },
        _getFirstVisibleLeaf: function (c) {
            if (c.isExpanded) {
                var d = false;
                for (var b = 0; b < c.items.length; b++) {
                    if (c.items[b].isHidden == false && c.items[b].isFiltered == false) {
                        c = c.items[b];
                        c = this._getFirstVisibleLeaf(c);
                        d = true;
                        break
                    }
                }
                if (d) {
                    return c
                }
            }
            if (c.hasVisibleValueItems) {
                var d = false;
                for (var b = 0; b < c.valueItems.length; b++) {
                    if (c.valueItems[b].isHidden == false && c.valueItems[b].isFiltered == false) {
                        c = c.valueItems[b];
                        c = this._getFirstVisibleLeaf(c);
                        d = true;
                        break
                    }
                }
                if (d) {
                    return c
                }
            }
            return c
        },
        _getLastVisibleLeaf: function (c) {
            var d = false;
            for (var b = c.valueItems.length - 1; b >= 0; b--) {
                if (c.valueItems[b].isHidden == false && c.valueItems[b].isFiltered == false) {
                    c = c.valueItems[b];
                    c = this._getLastVisibleLeaf(c);
                    d = true;
                    break
                }
            }
            if (d) {
                return c
            }
            for (var b = c.items.length - 1; b >= 0 && c.isExpanded; b--) {
                if (c.items[b].isHidden == false && c.items[b].isFiltered == false) {
                    c = c.items[b];
                    c = this._getLastVisibleLeaf(c);
                    break
                }
            }
            return c
        }
    });
    a.jqx.jqxPivotGrid.hierarchy = function () {
        this.parentPivotGrid = arguments[0];
        this._initDefaults()
    };
    a.extend(a.jqx.jqxPivotGrid.hierarchy.prototype, {
        _initDefaults: function () {
            this.columnWidths = new Array();
            this.rowHeights = new Array();
            this.items = new Array();
            this.valueItems = new Array();
            this.visibleLeafItems = new Array();
            this.viewPort = new Object();
            this.viewPort.x = 0;
            this.viewPort.y = 0;
            this.viewPort.width = 10000;
            this.viewPort.height = 10000;
            this.isFixed = false;
            this.isHidden = false;
            this.resizable = true;
            this.sortable = true;
            this._renderRequired = true;
            this.maxVisibleLevelDepth = -1;
            this.showExpandCollapseButtons = true;
            this.x = 0;
            this.y = 0;
            this._width = 0;
            this._height = 0;
            this.minColumnWidth = 18;
            this._isColumnsCountRequresUpdate = true;
            this._selectedItems = new Object();
            this.virtualModeThreshold = 5000;
            this._isVirtualMode = true
        },
        isVisible: function () {
            return !this.isHidden
        },
        toggle: function () {
            if (this.isHidden) {
                this.show()
            } else {
                this.hide()
            }
        },
        getOtherHierarchy: function () {
            return (this.isColumnsHierarchy) ? this.parentPivotGrid._pivotRows : this.parentPivotGrid._pivotColumns
        },
        show: function () {
            this.isHidden = false;
            this._renderRequired = true;
            this.getOtherHierarchy()._renderRequired = true
        },
        hide: function () {
            this.isHidden = true;
            this._renderRequired = true;
            this.getOtherHierarchy()._renderRequired = true
        },
        refresh: function () {
            var j = this.parentPivotGrid;
            var b = j.toThemeProperty("jqx-widget-content jqx-fill-state-pressed jqx-widget-header");
            var r = j.toThemeProperty("jqx-widget-content jqx-fill-state-normal jqx-widget-header");
            var k = a.jqx.get(this, "renderCanvas");
            var p = this._renderRequired || this._refreshRequired;
            if (!p) {
                return
            }
            if (this._renderRequired) {
                this.render()
            }
            if (this.isHidden) {
                return
            }
            var d = new Array();
            var s = new Date();
            var x = this._getItemsToRender();
            if (!x) {
                return
            }
            for (var A = 0; A < x.length; A++) {
                var F = x[A];
                var q = F.getDisplayWidth() - 1;
                var B = F.getDisplayHeight() - 1;
                var v = F._element;
                if (a.isFunction(j.itemsRenderer)) {
                    var n = j.itemsRenderer(F);
                    if (v && F._currentCustomContent != n) {
                        k.removeChild(v);
                        v = F._element = null
                    }
                    F._currentCustomContent = n
                }
                if (!v) {
                    var u = {
                        left: 4,
                        top: 4,
                        right: 4,
                        bottom: 4
                    };
                    if (!this.isColumnsHierarchy && this.compactStyleRenderingEnabled) {
                        u.left += F.itemLevel * this.compactStyleRenderingItemsIndent
                    }
                    var I = F.text;
                    var m = "left";
                    if (a.isFunction(j.itemsRenderer)) {
                        I = F._currentCustomContent;
                        u = {
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0
                        }
                    } else {
                        var g = "";
                        if (F.items.length != 0 && F.hierarchy.showExpandCollapseButtons) {
                            if (F.isExpanded) {
                                g = "<div style='position: relative; top: 3px; padding: 5px; width: 11px; height: 11px;' class='jqx-pivotgrid-collapse-button'></div>"
                            } else {
                                g = "<div style='position: relative; top: 3px; padding: 5px; width: 11px; height: 11px;' class='jqx-pivotgrid-expand-button'></div>"
                            }
                        }
                        var G = "";
                        if (F.hierarchy._sortItem == F) {
                            var z = F.hierarchy._sortOrder == "desc" ? "sortdesc jqx-grid-column-sortdescbutton " + this.parentPivotGrid.toThemeProperty("jqx-icon-arrow-down") : "sortasc jqx-grid-column-sortascbutton " + this.parentPivotGrid.toThemeProperty("jqx-icon-arrow-up");
                            G = "<div id='sortElement' class='" + z + "' style='position: relative; float: right; padding-right: 8px; width: 16px; height: 100%;'></div>"
                        }
                        var y = F.text;
                        if (F.adapterItem.boundField) {
                            m = F.adapterItem.boundField.align || "left"
                        }
                        m = m.toString().toLowerCase();
                        if (m != "center" && m != "right") {
                            m = "left"
                        }
                        if (G != "") {
                            var l = 0;
                            var o = 24;
                            if (g != "") {
                                l = 23;
                                o += l
                            }
                            I = g + "<div><div style='left: " + l + "px; top: 0; position: absolute; height: 100%; width: calc(100% - " + o + "px); text-overflow: ellipsis; overflow: hidden;  white-space: nowrap;padding-left:" + u.left + "px; padding-top:" + u.top + "px; '>" + y + "</div><div style='left: 0; top: 0; position: absolute; height: 100%; width: 100%;'>" + G + "</div></div>"
                        } else {
                            I = g + y + G
                        }
                    }
                    v = j.createDiv(k, "", q, B);
                    j.setDivContent(v, I, u, m, true);
                    var J = this.parentPivotGrid.getChild(v, "innerDiv");
                    J.className = "jqx-pivotgrid-item";
                    j.setElementPosition(v, F.x, F.y);
                    v.originalY = v.style.top
                }
                F.tRender = s;
                var f = F.isSelected ? b : r;
                var c = F.isSelected ? "classNameSelected" : "className";
                var H = a.jqx.getByPriority([F[c], (F.adapterItem && F.adapterItem.boundField) ? F.adapterItem.boundField[c] : undefined, this.hierarchy ? this.hierarchy[c] : undefined]);
                if (H) {
                    f += " " + H
                }
                f += " jqx-pivotgrid-content-wrapper";
                if (f != v.className) {
                    v.className = f
                }
                v.style.display = "block";
                v.item = F;
                F._element = v
            }
            for (var A = 0; A < k.childNodes.length; A++) {
                if (k.childNodes[A].item && k.childNodes[A].item.tRender != s) {
                    d.push(k.childNodes[A])
                }
            }
            var E = 100;
            while (true) {
                var e = d.pop();
                if (!e) {
                    break
                } else {
                    if (k.childNodes.length > E) {
                        e.item._element = undefined;
                        k.removeChild(e)
                    } else {
                        e.item._element.style.display = "none"
                    }
                }
            }
            var C = !this.isColumnsHierarchy ? -j._offsetY : 0;
            var D = this.isColumnsHierarchy ? -j._offsetX : 0;
            j.setElementPosition(k, D, C);
            this._refreshRequired = false
        },
        clear: function () {
            this._initDefaults();
            this._resetCanvas();
            this.items = [];
            this.valueItems = [];
            this._renderRequired = true
        },
        _resetCanvas: function () {
            var b = a.jqx.get(this, "renderCanvas");
            if (!b) {
                return
            }
            while (b.hasChildNodes()) {
                b.firstChild.item._element = undefined;
                b.removeChild(b.firstChild)
            }
        },
        autoResize: function (b) {
            for (var c = 0; c < this.items.length; c++) {
                this.items[c].autoResize(b)
            }
            for (var c = 0; c < this.valueItems.length; c++) {
                this.valueItems[c].autoResize(b)
            }
        },
        getMaxVisibleLevelDepth: function () {
            if (this.maxVisibleLevelDepth == -1 || this._renderRequired) {
                var c = this._getVisibleLeafLevelItems();
                this.maxVisibleLevelDepth = 0;
                for (var b = 0; b < c.length; b++) {
                    if (c[b].itemLevel > this.maxVisibleLevelDepth) {
                        this.maxVisibleLevelDepth = c[b].itemLevel
                    }
                }
            }
            return this.maxVisibleLevelDepth
        },
        getHierarchyDepth: function () {
            var d = 0;
            for (var c = 0; c < this.items.length; c++) {
                var b = this.items[c]._getChildItemsDepth();
                if (b > d) {
                    d = b
                }
            }
            for (var c = 0; c < this.valueItems.length; c++) {
                var b = this.valueItems[c]._getChildItemsDepth();
                if (b > d) {
                    d = b
                }
            }
            return d
        },
        getSortItem: function () {
            return this._sortItem
        },
        getSortOrder: function () {
            return this._sortOrder
        },
        _fnAscSortComparer: function (c, b) {
            var h = c.hierarchy.parentPivotGrid;
            var e = c.isColumn ? h._pivotRows : h._pivotColumns;
            var i = e._sortItem;
            if (!i) {
                return 0
            }
            if (c.adapterItem && c.adapterItem.isTotal) {
                return 1
            }
            if (b.adapterItem && b.adapterItem.isTotal) {
                return -1
            }
            var g = h._pivotCells;
            var f = c.isColumn ? g.getCellValue(i, c) : g.getCellValue(c, i);
            var d = b.isColumn ? g.getCellValue(i, b) : g.getCellValue(b, i);
            return f.value - d.value
        },
        _fnDescSortComparer: function (c, b) {
            if (c.adapterItem && c.adapterItem.isTotal) {
                return 1
            }
            if (b.adapterItem && b.adapterItem.isTotal) {
                return -1
            }
            return -1 * a.jqx.jqxPivotGrid.hierarchy.prototype._fnAscSortComparer(c, b)
        },
        _collectionSort: function (f, c, b) {
            if (!this.parentPivotGrid || !this.parentPivotGrid._pivotCells) {
                return
            }
            var e = !this.isColumnsHierarchy ? this.parentPivotGrid._pivotColumns : this.parentPivotGrid._pivotRows;
            if (!f) {
                f = this.items
            }
            if (!c) {
                c = e._sortOrder == "asc" ? this._fnAscSortComparer : this._fnDescSortComparer
            }
            if (this._isSorted && !b) {
                this._collectionRemoveSort(f)
            }
            for (var d = 0; d < f.length; d++) {
                f[d]._itemOrdinal = d;
                this._collectionSort(f[d].items, c, true)
            }
            f = f.sort(c);
            if (!b) {
                this._isSorted = true;
                this._renderRequired = true;
                e._renderRequired = true;
                this._updateVisibleLeaves()
            }
        },
        _collectionRemoveSort: function (f, c) {
            if (!this._isSorted) {
                return
            }
            if (!f) {
                f = this.items
            }
            var b = new Array(f.length);
            for (var d = 0; d < f.length; d++) {
                b[f[d]._itemOrdinal] = f[d];
                this._collectionRemoveSort(f[d].items, true)
            }
            this.items = b;
            if (!c) {
                this._renderRequired = true;
                this._updateVisibleLeaves();
                if (this.isColumnsHierarchy) {
                    this._isColumnsCountRequresUpdate = true
                }
                this._isSorted = false;
                var e = this.isColumnsHierarchy ? this.parentPivotGrid._pivotRows : this.parentPivotGrid._pivotColumns;
                e._sortItem = undefined;
                e._sortOrder = undefined;
                e._renderRequired = true
            }
        },
        sortBy: function (f, c) {
            if (!f || f.isColumn == this.isColumnsHierarchy || f.valueItems.length > 0) {
                return
            }
            var e = new a.Event("sortchanging");
            e.owner = this.parentPivotGrid;
            e.args = {
                pivotItem: f,
                sortOrder: c
            };
            e.cancel = false;
            var d = this.parentPivotGrid.host;
            d.trigger(e);
            if (e.cancel) {
                return
            }
            this._collectionRemoveSort(this.items);
            var b = f.isColumn ? this.parentPivotGrid._pivotColumns : this.parentPivotGrid._pivotRows;
            b._sortItem = f;
            b._sortOrder = c;
            this._collectionSort();
            this.parentPivotGrid._internalRefresh();
            e = new a.Event("sortchanged");
            e.owner = this.parentPivotGrid;
            e.args = {
                pivotItem: f,
                sortOrder: c
            };
            var d = this.parentPivotGrid.host;
            d.trigger(e)
        },
        removeSort: function () {
            var f = this == this.parentPivotGrid._pivotColumns ? this.parentPivotGrid._pivotRows : this.parentPivotGrid._pivotColumns;
            var b = f._sortItem;
            var c = f._sortOrder;
            var e = new a.Event("sortremoving");
            e.owner = this.parentPivotGrid;
            e.args = {
                pivotItem: b,
                sortOrder: c
            };
            e.cancel = false;
            var d = this.parentPivotGrid.host;
            d.trigger(e);
            if (e.cancel) {
                return
            }
            this._collectionRemoveSort(this.items);
            this.parentPivotGrid._internalRefresh();
            e = new a.Event("sortremoved");
            e.owner = this.parentPivotGrid;
            e.args = {
                pivotItem: b,
                sortOrder: c
            };
            d.trigger(e)
        },
        _binSearchItems: function (c, b) {
            return this._binSearchItems2(c, b, 0, c.length)
        },
        _binSearchItems2: function (g, i, f, j) {
            var d = f;
            var e = j;
            if (e == d) {
                return -1
            }
            var b = g[0].isColumn;
            while (d < e) {
                var h = parseInt((d + e) / 2);
                var c = g[h];
                if (b) {
                    if (c.x > i.x) {
                        e = h
                    } else {
                        if ((h + 1 < e ? g[h + 1].x : c.x + c.getWidth()) < i.x) {
                            d = h + 1
                        } else {
                            return h
                        }
                    }
                } else {
                    if (c.y > i.y) {
                        e = h
                    } else {
                        if ((h + 1 < e ? g[h + 1].y : c.y + c.getTotalHeight()) < i.y) {
                            d = h + 1
                        } else {
                            return h
                        }
                    }
                }
            }
            return -1
        },
        _pointToLeafItemIndex: function (b) {
            if (this._renderRequired) {
                this.render()
            }
            var c = {
                x: b.x,
                y: b.y
            };
            c.x += -this.x + this.viewPort.x;
            c.y += -this.y + this.viewPort.y;
            var d = this._getVisibleLeafLevelItems();
            var e = this._binSearchItems(d, c);
            return e
        },
        _pointToLeafItem: function (b) {
            var c = this._getVisibleLeafLevelItems();
            var d = this._pointToLeafItemIndex(b);
            if (d == -1 || d < 0 || d >= c.length) {
                return null
            }
            c[d].lfIdx = d;
            return c[d]
        },
        _pointToLeafItemIndexAbsolute: function (c) {
            if (this._renderRequired) {
                this.render()
            }
            var b = this.viewPort.x - this.x;
            var g = this.viewPort.y - this.y;
            var d = {
                x: c.x,
                y: c.y
            };
            d.x -= this.x - (this.viewPort.x - this.x);
            d.y -= this.y - (this.viewPort.y - this.y);
            var e = this._getVisibleLeafLevelItems();
            var f = this._binSearchItems(e, d);
            return f
        },
        _pointToLeafItemAbsolute: function (b) {
            var c = this._getVisibleLeafLevelItems();
            var d = this._pointToLeafItemIndexAbsolute(b);
            if (d == -1 || d < 0 || d >= c.length) {
                return null
            }
            c[d].lfIdx = d;
            return c[d]
        },
        _pointInRect: function (b, c) {
            if (b.x >= c.x && b.x <= c.x + c.width && b.y >= c.y && b.y <= c.y + c.height) {
                return true
            }
            return false
        },
        hitTest: function (c) {
            if (this._renderRequired) {
                this.render()
            }
            var b = this.viewPort.x - this.x;
            var i = this.viewPort.y - this.y;
            if (!this._pointInRect({
                    x: c.x + b,
                    y: c.y + i
                }, this.viewPort) || this.isHidden) {
                return null
            }
            var e = {
                x: c.x,
                y: c.y
            };
            e.x -= this.x - (this.viewPort.x - this.x);
            e.y -= this.y - (this.viewPort.y - this.y);
            var f = this._getVisibleLeafLevelItems();
            var h = this._binSearchItems(f, e);
            if (h == -1) {
                return null
            } else {
                var d = f[h];
                var g = d.hitTest(e);
                if (g != null) {
                    return g
                }
                while (d != null) {
                    d = d.parentItem;
                    if (d != null) {
                        g = d.hitTest(e);
                        if (g != null) {
                            return g
                        }
                    }
                }
            }
            return null
        },
        _addColumn: function (b) {
            if (b < this.minColumnWidth) {
                b = this.minColumnWidth
            }
            this.columnWidths.push(b);
            return this.columnWidths.length - 1
        },
        setColumnWidth: function (c, b) {
            if (c >= this.columnWidths.length) {
                this._updateColumnsCount(c + 1)
            }
            if (b < this.minColumnWidth) {
                b = this.minColumnWidth
            }
            if (c < this.columnWidths.length) {
                this.columnWidths[c] = b
            }
            this._renderRequired = true;
            return true
        },
        getColumnWidth: function (b) {
            if (b >= this.columnWidths.length) {
                return 70
            }
            return this.columnWidths[b]
        },
        _getVisibleLeaves: function (g, f, c) {
            if (f.isHidden || f.isFiltered) {
                return true
            }
            if (f.items.length == 0 && f.valueItems.length == 0) {
                g.push(f);
                return true
            }
            if (c) {
                g.push(f)
            }
            if (f.isExpanded) {
                for (var e = 0; e < f.items.length; e++) {
                    var d = f.items[e];
                    if (d.isHidden || d.isFiltered) {
                        continue
                    }
                    if ((f.items.length > 0 && d.isExpanded) || d.hasVisibleValueItems()) {
                        this._getVisibleLeaves(g, d, c)
                    } else {
                        g.push(d)
                    }
                }
            }
            for (var e = 0; e < f.valueItems.length; e++) {
                var b = f.valueItems[e];
                if (b.isHidden || b.isFiltered) {
                    continue
                }
                g.push(b)
            }
            return true
        },
        _getVisibleLeafLevelItems: function () {
            if (this.visibleLeafItems.length == 0) {
                this._updateVisibleLeaves()
            }
            return this.visibleLeafItems
        },
        _updateVisibleLeaves: function () {
            this.visibleLeafItems = new Array();
            if (this.items.length + this.valueItems.length == 0) {
                return
            }
            var b = !this.isColumnsHierarchy && this.compactStyleRenderingEnabled;
            for (var c = 0; c < this.items.length; c++) {
                var d = this.items[c];
                if (d.isHidden || d.isFiltered) {
                    continue
                }
                if (d.isExpanded || d.hasVisibleValueItems()) {
                    this._getVisibleLeaves(this.visibleLeafItems, d, b)
                } else {
                    this.visibleLeafItems.push(d)
                }
            }
            for (var c = 0; c < this.valueItems.length; c++) {
                var d = this.valueItems[c];
                if (d.isHidden || d.isFiltered) {
                    continue
                }
                if (d.isExpanded || d.hasVisibleValueItems()) {
                    this._getVisibleLeaves(this.visibleLeafItems, d, b)
                } else {
                    this.visibleLeafItems.push(d)
                }
            }
            for (var c = 0; c < this.visibleLeafItems.length; c++) {
                this.visibleLeafItems[c]._lfIndex = c
            }
            this._updateItemsLevelAndColumn()
        },
        _getFirstLeafIndexToRender: function () {
            var b = {
                x: this.x,
                y: this.y
            };
            var c = {
                x: b.x,
                y: b.y
            };
            c.x -= this.x - (this.viewPort.x - this.x);
            c.y -= this.y - (this.viewPort.y - this.y);
            var d = this._binSearchItems(this._getVisibleLeafLevelItems(), c);
            return d
        },
        _getLastLeafIndexToRender: function () {
            var c = {
                x: Math.min(this.viewPort.width, this.getWidth()) - 5,
                y: Math.min(this.viewPort.height, this.getHeight()) - 5
            };
            var b = this._pointToLeafItemIndex(c);
            return b
        },
        _getLeafItemsToRender: function () {
            var b = {};
            b.items = this._getVisibleLeafLevelItems();
            b.first = this._getFirstLeafIndexToRender();
            b.last = this._getLastLeafIndexToRender();
            return b
        },
        _getItemsToRender: function () {
            var g = this._getLeafItemsToRender();
            var j = g.first;
            var e = g.last;
            if (j == -1 || e == -1) {
                return
            }
            var c = {};
            for (b = j; b <= e; b++) {
                var d = g.items[b];
                c[d.id] = d;
                while (d.parentItem != null) {
                    d = d.parentItem;
                    c[d.id] = d
                }
            }
            var f = new Array();
            for (var b in c) {
                f.push(c[b])
            }
            return f
        },
        _updateItemsLevelAndColumn2: function (c, d) {
            c.itemColumn = d;
            c.itemLevel = d;
            for (var b = 0; b < c.items.length; b++) {
                this._updateItemsLevelAndColumn2(c.items[b], d + 1)
            }
            for (var b = 0; b < c.valueItems.length; b++) {
                this._updateItemsLevelAndColumn2(c.valueItems[b], d + 1)
            }
        },
        _updateItemsLevelAndColumn: function () {
            for (var b = 0; b < this.items.length; b++) {
                this._updateItemsLevelAndColumn2(this.items[b], 0)
            }
            for (var b = 0; b < this.valueItems.length; b++) {
                this._updateItemsLevelAndColumn2(this.valueItems[b], 0)
            }
        },
        updateColumnsCount: function () {
            this.updateColumnsCount(0)
        },
        getTotalItemsCount: function () {
            var c = 0;
            if (this.items.length == 0 && this.valueItems.length == 0) {
                c = 1
            } else {
                for (var b = 0; b < this.items.length; b++) {
                    c += this.items[b].getTotalItemsCount()
                }
                for (var b = 0; b < this.valueItems.length; b++) {
                    c += this.valueItems[b].getTotalItemsCount()
                }
            }
            return c
        },
        _updateColumnsCount: function (c) {
            var f = this._getColumnsCount();
            var b = this.getTotalItemsCount();
            if (c > 1024) {
                c = 1024
            }
            if (this.isColumnsHierarchy) {
                if (c > b) {
                    b = c
                }
            } else {
                var e = this.getHierarchyDepth();
                b = c > e ? c : e
            }
            for (var d = f; d < b; d++) {
                this._addColumn(70)
            }
            this._isColumnsCountRequresUpdate = false
        },
        _updateColumnsIndexes: function () {
            for (var b in this.items) {
                this._updateItemsLevelAndColumn2(this.items[b], 0)
            }
            for (var b in this.valueItems) {
                this._updateItemsLevelAndColumn2(this.valueItems[b], 0)
            }
        },
        _getColumnsCount: function () {
            return this.columnWidths.length
        },
        _getRenderedItems: function () {
            var b = new Array();
            this._getChildItemsToRender(b);
            return b
        },
        _getChildItemsToRender: function (d) {
            for (var b = 0; b < this.items.length; b++) {
                var c = this.items[b];
                if (c.isHidden || c.isFiltered) {
                    continue
                }
                d.push(c);
                if (c.isExpanded) {
                    c._getChildItemsToRender(d)
                }
            }
        },
        getWidth: function () {
            if (this._renderRequired) {
                this.render()
            }
            return this._width
        },
        getHeight: function () {
            if (this._renderRequired) {
                this.render()
            }
            return this._height
        },
        _beginSelectionUpdate: function () {
            for (var b in this._selectedItems) {
                this._selectedItems[b].OldIsSelected = this._selectedItems[b].isSelected
            }
        },
        _endSelectionUpdate: function () {
            var f = new Array();
            for (var b in this._selectedItems) {
                var e = this._selectedItems[b];
                if (!e.isSelected) {
                    f.push(this._selectedItems[b])
                }
                if (e.isSelected != e.OldIsSelected && (e.parentItem == null || e.parentItem.isExpanded == true || e._isValueItem)) {
                    var d = new a.Event("pivotitemselectionchanged");
                    d.owner = this.parentPivotGrid;
                    d.args = {
                        pivotItem: e,
                        selected: e.isSelected
                    };
                    this.parentPivotGrid.host.trigger(d)
                }
            }
            for (var b in f) {
                var c = this._selectedItems[f[b].adapterItem.key];
                c.isSelected = c.OldIsSelected = false;
                delete this._selectedItems[f[b].adapterItem.key]
            }
        },
        selectItem: function (b) {
            if (!this.parentPivotGrid.selectionEnabled) {
                return
            }
            this._beginSelectionUpdate();
            this._internalSelectItem(b);
            this._endSelectionUpdate()
        },
        _internalSelectItem: function (d) {
            if (null == d) {
                return
            }
            if (d.isColumn != this.isColumnsHierarchy) {
                return
            }
            if (this.isColumnsHierarchy && this.isGroupingColumn(d)) {
                return
            }
            var c = d.adapterItem.key;
            if (this._selectedItems[c] == undefined) {
                this._selectedItems[c] = d
            }
            d.isSelected = true;
            this._refreshRequired = true;
            this.parentPivotGrid._pivotCells._refreshRequired = true;
            if (!this.isColumnsHierarchy && d.hierarchy.compactStyleRenderingEnabled) {
                return
            }
            for (var b in d.items) {
                this._internalSelectItem(d.items[b])
            }
            for (var b in d.valueItems) {
                this._internalSelectItem(d.valueItems[b])
            }
        },
        unselectItem: function (b) {
            this._beginSelectionUpdate();
            this._internalUnselectItem(b);
            this._endSelectionUpdate()
        },
        _internalUnselectItem: function (d) {
            if (null == d) {
                return
            }
            if (d.isColumn != this.isColumnsHierarchy) {
                return
            }
            var c = d.adapterItem.key;
            if (this._selectedItems[c]) {
                this._selectedItems[c].isSelected = false;
                this._refreshRequired = true;
                this.parentPivotGrid._pivotCells._refreshRequired = true
            }
            if (!this.isColumnsHierarchy && d.hierarchy.compactStyleRenderingEnabled) {
                return
            }
            for (var b in d.items) {
                this._internalUnselectItem(d.items[b])
            }
            for (var b in d.valueItems) {
                this._internalUnselectItem(d.valueItems[b])
            }
        },
        _internalClearSelection: function () {
            for (var b in this._selectedItems) {
                this._internalUnselectItem(this._selectedItems[b])
            }
        },
        clearSelection: function () {
            this._beginSelectionUpdate();
            this._internalClearSelection();
            this._endSelectionUpdate()
        },
        _applySelectionToParentItem: function (h) {
            var c = h.parentItem;
            if (c == undefined || c == null) {
                return
            }
            var d = h.hierarchy;
            var b = true;
            if (c.isExpanded) {
                for (var g in c.items) {
                    var f = c.items[g];
                    if (false == f.isSelected && f.isHidden == false) {
                        b = false;
                        break
                    }
                }
            }
            if (b) {
                for (var g in c.valueItems) {
                    var f = c.valueItems[g];
                    if (false == f.isSelected && f.isHidden == false) {
                        b = false;
                        break
                    }
                }
            }
            if (b) {
                var e = c.adapterItem.key;
                if (d._selectedItems[e] == undefined) {
                    d._selectedItems[e] = c
                }
                c.isSelected = true;
                this._applySelectionToParentItem(c)
            }
        },
        _applySelectionToParentItems: function () {
            for (var b in this._selectedItems) {
                this._applySelectionToParentItem(this._selectedItems[b])
            }
        },
        getSelectedItems: function () {
            var c = new Array();
            for (var b in this._selectedItems) {
                if (this._selectedItems[b].isSelected) {
                    c.push(b)
                }
            }
            return c
        }
    });
    a.jqx.jqxPivotGrid.pivotRows = function (b) {
        a.extend(this, new a.jqx.jqxPivotGrid.hierarchy);
        this.parentPivotGrid = b;
        this.isColumnsHierarchy = false;
        this.compactStyleRenderingEnabled = false;
        this.compactStyleRenderingItemsIndent = 20
    };
    a.extend(a.jqx.jqxPivotGrid.pivotRows.prototype, a.jqx.jqxPivotGrid.hierarchy.prototype);
    a.extend(a.jqx.jqxPivotGrid.pivotRows.prototype, {
        setColumnWidth: function (c, b) {
            if (c >= this.columnWidths.Count) {
                this._updateColumnsCount(c + 1)
            }
            if (this.compactStyleRenderingEnabled) {
                c = 0
            }
            if (c < this.columnWidths.length) {
                this.columnWidths[c] = b
            }
            this._renderRequired = true;
            return true
        },
        updateBounds: function () {
            var b = 0;
            var g = 0;
            for (var l = 0; l < 2; l++) {
                var k = (l == 0) ? this.items : this.valueItems;
                for (var e = 0; e < k.length; e++) {
                    var j = k[e];
                    if (j.isHidden) {
                        continue
                    }
                    var f = j.getHeightWithChildren();
                    b += f;
                    var d = j.getWidthWithChildren();
                    if (g < d) {
                        g = d
                    }
                }
            }
            this._width = g;
            this._height = b + 1
        },
        render: function () {
            if (this._renderSuppressed) {
                return
            }
            this._refreshRequired = true;
            this.parentPivotGrid._pivotCells._refreshRequired = true;
            this.isRendering = true;
            if (this._isColumnsCountRequresUpdate) {
                this._updateColumnsCount()
            }
            while (this._getColumnsCount() < this.getHierarchyDepth()) {
                a.jqx.get(this, "columnWidths").push(70)
            }
            this._updateVisibleLeaves();
            if (this.compactStyleRenderingEnabled) {
                if (this.columnWidths.Count == 0) {
                    this._addColumn(70)
                }
                var e = this.columnWidths[0];
                var k = this.getHierarchyDepth();
                if (e < k * (this.compactStyleRenderingItemsIndent)) {
                    e = k * (this.compactStyleRenderingItemsIndent)
                }
                this.columnWidths[0] = e
            }
            this.updateBounds();
            var l = 0;
            if (this.items.length + this.valueItems.length == 0) {
                if (this.parentPivotGrid != null) {
                    this.parentPivotGrid.isSyncScrollRequired = true
                }
                this.isRendering = false;
                this._renderRequired = false;
                return
            }
            for (var c = 0; c < 2; c++) {
                var g = (c == 0) ? this.items : this.valueItems;
                for (var b = 0; b < g.length; b++) {
                    var f = g[b];
                    if (f.hierarchy == null) {
                        f.hierarchy = this
                    }
                    if (f.isHidden) {
                        continue
                    }
                    var d = f.getHeightWithChildren();
                    if (f.itemLevel < this.columnWidths.length && f.getWidth() > this.columnWidths[f.itemLevel]) {
                        this.columnWidths[f.itemLevel] = f.getWidth()
                    }
                    if (!f.render(0, l)) {
                        break
                    }
                    l += d
                }
            }
            this.updateBounds();
            if (this.parentPivotGrid != null) {
                this.parentPivotGrid.isSyncScrollRequired = true
            }
            this._resetCanvas();
            this._renderRequired = false;
            this.isRendering = false
        },
        isOnRowDetails: function (b, d) {
            if (!d.RowDetailsVisible) {
                return false
            }
            var c = {
                x: b.x,
                y: b.y
            };
            c.x += -this.x + this.viewPort.x;
            c.y += -this.y + this.viewPort.y;
            if (c.y < d.y + d.getDisplayHeight() && c.y > d.y + d.getDisplayHeight() - d.RowDetailsHeight) {
                return true
            }
            return false
        }
    });
    a.jqx.jqxPivotGrid.pivotColumns = function (b) {
        a.extend(this, new a.jqx.jqxPivotGrid.hierarchy);
        this.parentPivotGrid = b;
        this.isColumnsHierarchy = true
    };
    a.extend(a.jqx.jqxPivotGrid.pivotColumns.prototype, a.jqx.jqxPivotGrid.hierarchy.prototype);
    a.extend(a.jqx.jqxPivotGrid.pivotColumns.prototype, {
        render: function () {
            if (this._renderSuppressed) {
                return
            }
            this._refreshRequired = true;
            this.parentPivotGrid._pivotCells._refreshRequired = true;
            this._updateVisibleLeaves();
            this._updateColumnsIndexes();
            if (this.items.length + this.valueItems.length == 0) {
                if (this.parentPivotGrid != null) {
                    this.parentPivotGrid.isSyncScrollRequired = true
                }
                this._updateVisibleLeaves();
                return
            }
            var b = 0;
            for (var e = 0; e < 2; e++) {
                var g = (e == 0) ? this.items : this.valueItems;
                for (var d = 0; d < g.length; d++) {
                    var f = g[d];
                    if (f.hierarchy == null) {
                        f.hierarchy = this
                    }
                    if (f.isHidden) {
                        continue
                    }
                    var c = f.getWidthWithChildren();
                    if (!f.render(b, 0)) {
                        break
                    }
                    b += c
                }
            }
            this._renderRequired = false;
            if (this.parentPivotGrid != null) {
                this.parentPivotGrid.isSyncScrollRequired = true
            }
            this._updateVisibleLeaves();
            this.updateBounds();
            this._resetCanvas()
        },
        updateBounds: function () {
            var b = 0;
            var f = 0;
            for (var d = 0; d < 2; d++) {
                var k = (d == 0) ? this.items : this.valueItems;
                for (var c = 0; c < k.length; c++) {
                    var g = k[c];
                    var e = g.getHeightWithChildren();
                    if (b < e) {
                        b = e
                    }
                    f += g.getWidthWithChildren()
                }
            }
            this._height = b;
            this._width = f + 1
        },
        _updateColumnsIndexes: function () {
            var e = this.visibleLeafItems.length;
            for (var c = --e; c >= 0; c--) {
                var d = this.visibleLeafItems[c];
                d.itemColumn = c;
                var b = d.parentItem;
                while (b != null) {
                    if (b.hierarchy != d.hierarchy) {
                        b = null
                    } else {
                        b.itemColumn = c;
                        d = b;
                        b = d.parentItem
                    }
                }
            }
        },
        setRowHeight: function (c, b) {
            if (b < 15 || b > 500) {
                return false
            }
            c.hierarchyItemHeight = b;
            this._renderRequired = true;
            return true
        },
        isGroupingColumn: function (b) {
            if (b == null) {
                return false
            }
            if (this.parentPivotGrid == null) {
                return false
            }
            if (b.ItemIndex < this.parentPivotGrid.groupingColumns.length && this.parentPivotGrid.isGroupingEnabled) {
                return true
            }
            return false
        }
    })
})(jqxBaseFramework);
(function (a) {
    a.extend(a.jqx._jqxPivotGrid.prototype, {
        _handleKeyboardNavigation: function (b) {
            if (this._internalSelectMode == "CELLS_SELECT") {
                return this._handleCellsKeyboardNavigation(b)
            } else {
                if (this._internalSelectMode == "ROW_SELECT" || this._internalSelectMode == "COL_SELECT") {}
            }
            return false
        },
        _handleCellsKeyboardNavigation: function (e) {
            var k = this._cellKBRangeSelectionEnd;
            var f = undefined;
            var m = this;
            if (!k) {
                return false
            }
            if (e.keyCode == 37) {
                f = this._pivotCells.getNextCell(k, "left")
            }
            if (e.keyCode == 38) {
                f = this._pivotCells.getNextCell(k, "top")
            } else {
                if (e.keyCode == 39) {
                    f = this._pivotCells.getNextCell(k, "right")
                } else {
                    if (e.keyCode == 40) {
                        f = this._pivotCells.getNextCell(k, "bottom")
                    }
                }
            }
            if (f != null) {
                this._pivotRows._refreshRequired = true;
                this._pivotColumns._refreshRequired = true;
                this._pivotCells._refreshRequired = true;
                this._colItemRangeSelectionBeg = f.pivotColumn;
                this._rowItemRangeSelectionBeg = f.pivotRow;
                this._beginSelectionUpdate();
                if (!this._isCTRLPressed || false == this.multipleSelectionEnabled) {
                    this._internalClearSelection()
                }
                this._pivotCells._internalSelectCell(this._rowItemRangeSelectionBeg, this._colItemRangeSelectionBeg);
                this._cellKBRangeSelectionEnd = {
                    pivotRow: this._rowItemRangeSelectionBeg,
                    pivotColumn: this._colItemRangeSelectionBeg,
                    pivotCells: this._pivotCells
                };
                if (!this._cellKBRangeSelectionStart || !this._isSHIFTPressed) {
                    this._cellKBRangeSelectionStart = {
                        pivotRow: this._rowItemRangeSelectionBeg,
                        pivotColumn: this._colItemRangeSelectionBeg,
                        pivotCells: this._pivotCells
                    }
                }
                var l = Math.min(this._cellKBRangeSelectionStart.pivotColumn._lfIndex, this._cellKBRangeSelectionEnd.pivotColumn._lfIndex);
                var h = Math.max(this._cellKBRangeSelectionStart.pivotColumn._lfIndex, this._cellKBRangeSelectionEnd.pivotColumn._lfIndex);
                var n = Math.min(this._cellKBRangeSelectionStart.pivotRow._lfIndex, this._cellKBRangeSelectionEnd.pivotRow._lfIndex);
                var i = Math.max(this._cellKBRangeSelectionStart.pivotRow._lfIndex, this._cellKBRangeSelectionEnd.pivotRow._lfIndex);
                for (var j = l; j <= h; j++) {
                    for (var b = n; b <= i; b++) {
                        var g = this._pivotColumns.visibleLeafItems[j];
                        var d = this._pivotRows.visibleLeafItems[b];
                        this._pivotCells._internalSelectCell(d, g)
                    }
                }
                this._endSelectionUpdate();
                f.pivotRow.ensureVisible();
                f.pivotColumn.ensureVisible();
                this._internalRefresh()
            }
            return false
        }
    })
})(jqxBaseFramework);