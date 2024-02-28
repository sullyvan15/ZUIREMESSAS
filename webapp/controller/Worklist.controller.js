sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/comp/smartvariants/PersonalizableInfo',
    "sap/m/DynamicDateOption",
	'sap/m/DynamicDateValueHelpUIType',
	'sap/m/StepInput',
	'sap/m/Label',
	'sap/ui/core/LocaleData',
	"sap/ui/core/Core",
	"sap/ui/commons/MessageBox",
    'sap/ui/model/type/String',
    'sap/m/SearchField',
    'sap/m/Column',
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog"
    
], function (BaseController,
	JSONModel,
	formatter,
	Filter,
	FilterOperator,
	PersonalizableInfo,
	DynamicDateOption,
	DynamicDateValueHelpUIType,
	StepInput,
	Label,
	LocaleData,
	Core,
	MessageBox,
    TypeString,
    SearchField,
    UIColumn,
    ValueHelpDialog
    
    
    
    ) {
    "use strict";
    var lineItemTable = 0;
    var bSelected;
    var arrayFiltersExcel  = new Array;
    var url = "/sap/opu/odata/SAP/ZGWFI_REL_REMESSA_SRV/";
    return BaseController.extend("zuiremessas.controller.Worklist", {

        formatter: formatter,

        onInit : function () {
       this.onVariantsInitialized();

	    var oMultiInput = this.byId("fieldBarCliente");
        var inputCFOP = this.byId("fieldBarCFOP");
        var inputCFOPdevolv = this.byId("fieldBarCFOPDevolv");
  
        this._inputCFOP = inputCFOP;
        this._inputCFOPdevolv = inputCFOPdevolv;

        var oToken = new sap.m.Token({
            key: "1", 
            text: "5663AA" 
        });
        this._inputCFOP.addToken(oToken);

        var oToken = new sap.m.Token({
            key: "1", 
            text: "2664AA"
        });
        this._inputCFOPdevolv.addToken(oToken);

        },

        onAfterRendering: function() {
            var oSmartTable = this.byId("smartTreeTable");
            var oTable = oSmartTable.getTable();

            for (var i = 0; i < oTable.getColumns().length; i++) {
                    oTable.autoResizeColumn(i);
                }
        },

        onBeforeExport: function (oEvt) {
            var oExport = oEvt.getParameter("exportSettings");
            oExport.dataSource.count = this.byId("hierTable_org_hier").getBinding("rows").getLength();
        },
   
    onVariantsInitialized: function(oEvent) {

        this.oSmartVariantManagement = this.getView().byId("svm");
        this.oTable = this.getView().byId("hierTable_org_hier");

        var oPersInfo = new PersonalizableInfo({
            type: "filterBar",
            keyName: "persistencyKey",
            dataSource: "",
            control: this.oFilterBar
        });
        this.oSmartVariantManagement.addPersonalizableControl(oPersInfo);
        this.oSmartVariantManagement.initialise(function () {}, this.oFilterBar);    

    },

        onRefresh : function () {
            var oTable = this.byId("hierTable_org_hier");
            oTable.getBinding("rows").refresh();
            this.onAfterRendering(); 
        },

        onSearch: function() {
            var arrayFilters  = [];
            
            for (let i = 0; i < this.byId("fieldBarCliente").getTokens().length; i++) {
                var filterCliente = new sap.ui.model.Filter("BR_NFPARTNER",  sap.ui.model.FilterOperator.EQ, this.byId("fieldBarCliente").getTokens()[i].mAggregations.tooltip);
                arrayFilters.push(filterCliente);
            }

            for (let i = 0; i < this.byId("fieldBarCentro").getTokens().length; i++) {
                var filterCentro  = new sap.ui.model.Filter("PLANT",  sap.ui.model.FilterOperator.EQ, this.byId("fieldBarCentro").getTokens()[i].mAggregations.tooltip);
                arrayFilters.push(filterCentro);
            }
            
            var convData2 = this.getView().byId("DP2").getValue().split(".")[2] + this.getView().byId("DP2").getValue().split(".")[1] + this.getView().byId("DP2").getValue().split(".")[0];
            var convData1 = this.getView().byId("DP1").getValue().split(".")[2] + this.getView().byId("DP1").getValue().split(".")[1] + this.getView().byId("DP1").getValue().split(".")[0];
            //convData1 = '20200101'
            //convData2 = '20240101'
           
            var filterData    = new sap.ui.model.Filter("NFE_CREATIONDATE", sap.ui.model.FilterOperator.BT, convData1, convData2);
            arrayFilters.push(filterData);

            for (let i = 0; i < this.byId("fieldBarNota").getTokens().length; i++) {
                filterNota    = new sap.ui.model.Filter("BR_NOTAFISCAL", sap.ui.model.FilterOperator.EQ, this.byId("fieldBarNota").getTokens()[i].mAggregations.tooltip);
                arrayFilters.push(filterNota);
            }

            for (let i = 0; i < this.byId("fieldBarMaterial").getTokens().length; i++) {
            var filterMat     = new sap.ui.model.Filter("MATERIAL", sap.ui.model.FilterOperator.EQ, this.byId("fieldBarMaterial").getTokens()[i].mProperties.text);
            arrayFilters.push(filterMat);
            }

        for (let i = 0; i < this.byId("fieldBarCFOP").getTokens().length; i++) {
            var filtercfop     = new sap.ui.model.Filter("CFOP", sap.ui.model.FilterOperator.EQ, this.byId("fieldBarCFOP").getTokens()[i].mProperties.text);
            arrayFilters.push(filtercfop);
        }

        for (let i = 0; i < this.byId("fieldBarCFOPDevolv").getTokens().length; i++) {
            filtercfop     = new sap.ui.model.Filter("Devolv_CFOP", sap.ui.model.FilterOperator.EQ, this.byId("fieldBarCFOPDevolv").getTokens()[i].mProperties.text);
            arrayFilters.push(filtercfop);
        }
        
        var checkbox = this.getView().byId("itensCancelados").getSelected() === true ? "" : "X";
        var filterCancelados     = new sap.ui.model.Filter("checkbox", sap.ui.model.FilterOperator.EQ, checkbox);
        arrayFilters.push(filterCancelados);

    
        if (this.getView().byId("DP2").getValue() === "" || this.getView().byId("DP1").getValue() === "" || this.byId("fieldBarCFOP").getTokens().length === 0 || this.byId("fieldBarCFOP").getTokens().length === 0) {
            sap.m.MessageToast.show("Preencha todos os campos obrigatórios");  
            return
            }

            this.filters = arrayFilters;
            var n = this;
            this.getView().byId("hierTable_org_hier").bindRows({
                filters: arrayFilters,
                path : '/Remessas',
            
                parameters : {
                useServersideApplicationFilters: true,
                autoExpandMode:'Bundled',
                countMode: 'Inline',
                operationMode:'Client',    
                    treeAnnotationProperties : {
                        hierarchyLevelFor :  'HierarchyLevel',
                        hierarchyNodeFor : 'NodeID',
                        hierarchyParentNodeFor : 'ParentNodeID',
                        hierarchyDrillStateFor : 'DrillState'
                    }
                }
            });
            
            n.onRefresh(); 
        },


        onValueHelp: function(oEvent) {
           var campo =  this.byId(oEvent.oSource.sId.split("--")[2]);
           var path = campo.mBindingInfos.suggestionItems.path;
           this._oBasicSearchField = new SearchField();

           var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
            advancedMode: false,
            filterBarExpanded: true,
            showGoOnFB: true,
            useToolbar: true,
            search: function(oEvent) {
                var oBinding = oTable.getBinding("rows");
                var aFilters = [];
                    var sQuery = this._oBasicSearchField.getValue();
                    if (sQuery) {
                        var oFilter = new sap.ui.model.Filter(descricao, sap.ui.model.FilterOperator.Contains, sQuery);
                        aFilters.push(oFilter);
                    }

                oBinding.filter(aFilters);
                oBinding.refresh();
            }
        });
        oFilterBar.setBasicSearch(this._oBasicSearchField);

          if (campo.sId.includes("CFOP") === false) {
           var id = campo.mBindingInfos.suggestionItems.binding.oEntityType.property[1].name;
          }
           var descricao = campo.mBindingInfos.suggestionItems.binding.oEntityType.property[0].name === undefined ? campo.mBindingInfos.suggestionItems.binding.oEntityType.property[1].name : campo.mBindingInfos.suggestionItems.binding.oEntityType.property[0].name;

           var oTable = new sap.ui.table.Table({
            visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto,
            selectionMode: sap.ui.table.SelectionMode.Single,
        });
        if (id !== undefined) {
        var oColumn = new sap.ui.table.Column({
            label: new sap.ui.commons.Label({ text: "Código" }),
            template: new sap.ui.commons.TextView().bindProperty(
              "text",
              id
            ),
          });
          oTable.addColumn(oColumn);
        }

          var oColumn2 = new sap.ui.table.Column({
            label: new sap.ui.commons.Label({ text: "Descrição" }),
            template: new sap.ui.commons.TextView().bindProperty(
              "text",
              descricao
            ),
          });

        oTable.addColumn(oColumn2);

            var oValueHelpDialog = new ValueHelpDialog({
                supportRanges: true,
                supportRangesOnly: false,
                key: id === undefined ? descricao : id,
            //    descriptionKey: descricao,
                title: campo.mBindingInfos.suggestionItems.binding.oEntityType.name,
                supportMultiselect: true,
                
                ok: function(oEvent) {
                    var aTokens = oEvent.getParameter("tokens");
                    campo.setTokens(aTokens);
                    oValueHelpDialog.close();
                },
                cancel: function() {
                    oValueHelpDialog.close();
                }
            });
            oTable.bindAggregation("rows", {
                path: path,
            });

            oValueHelpDialog.setTable(oTable);
            oValueHelpDialog.setFilterBar(oFilterBar);

            var oModel = this.getView().getModel();
            oValueHelpDialog.setModel(oModel);
    
            oValueHelpDialog.open();
        },

    });
});
