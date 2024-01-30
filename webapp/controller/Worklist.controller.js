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
    'sap/m/Column'
    
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
    UIColumn
    
    
    
    ) {
    "use strict";
    var lineItemTable = 0;

    return BaseController.extend("zuiremessas.controller.Worklist", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */

        onInit : function () {
          

           this.onSearchHelps();
           this.onSearchHelps2();
           this.onSearchHelps3();
           this.onSearchHelps4();
           this.onVariantsInitialized();


           var oMultiInput, oMultiInputWithSuggestions;
			// Value Help Dialog standard use case with filter bar without filter suggestions
			oMultiInput = this.byId("productInput");
           var oMultiInput2 = this.byId("productInput2");
           var oMultiInput3 = this.byId("productInput4");
           var oMultiInput4 = this.byId("productInput5");
			oMultiInput.addValidator(this._onMultiInputValidate);
            oMultiInput2.addValidator(this._onMultiInputValidate);
            oMultiInput3.addValidator(this._onMultiInputValidate);
            oMultiInput4.addValidator(this._onMultiInputValidate);
            
			//oMultiInput.setTokens(this._getDefaultTokens());
			this._oMultiInput = oMultiInput;
            this._oMultiInput2 = oMultiInput2;
            this._oMultiInput3 = oMultiInput3;
            this._oMultiInput4 = oMultiInput4;
			// Whitespace
		

        },

        onToggleOpenState: function(oEvent) {
           // var iRowIndex = oEvent.getParameter("rowIndex");
           // var bExpanded = oEvent.getParameter("expanded");
        //
           // // Obter o contexto da linha
           // var oContext = this.getView().byId("treeTable").getContextByIndex(iRowIndex);
        //
           // // Obter o nível da linha
           // var iLevel = this.getView().getModel().getProperty("level", oContext);
            lineItemTable = lineItemTable + 1;
            // Se a linha está sendo expandida e o nível é maior que 1, impedir a expansão
            if (lineItemTable > 1) {
                oEvent.preventDefault();
            }
        },

        onSearchHelps: function () {
            
            var url = "/sap/opu/odata/SAP/ZGWFI_REL_REMESSA_SRV/";
            var odataModel = new sap.ui.model.odata.ODataModel(url);
            var n = this;
            odataModel.read("/Clientes?", {
                success: function(e, t) {
                    var o = new sap.ui.model.json.JSONModel({
                        Results: e.results
                    });
                    n.getView().setModel(o, "SearchHelp");
                },
                error: function(e) {
                    console.log("Erro ao ler os dados")
                }
            })

        },


        onSearchHelps2: function () {
            
            var url = "/sap/opu/odata/SAP/ZGWFI_REL_REMESSA_SRV/";
            var odataModel = new sap.ui.model.odata.ODataModel(url);
            var n = this;
            odataModel.read("/Centros?", {
                success: function(e, t) {
                    var o = new sap.ui.model.json.JSONModel({
                        Results: e.results
                    });
                    n.getView().setModel(o, "SearchHelp");
                },
                error: function(e) {
                    console.log("Erro ao ler os dados")
                }
            })

        },

        onSearchHelps3: function () {
            
            var url = "/sap/opu/odata/SAP/ZGWFI_REL_REMESSA_SRV/";
            var odataModel = new sap.ui.model.odata.ODataModel(url);
            var n = this;
            odataModel.read("/Notas?", {
                success: function(e, t) {
                    var o = new sap.ui.model.json.JSONModel({
                        Results: e.results
                    });
                    n.getView().setModel(o, "SearchHelp");
                },
                error: function(e) {
                    console.log("Erro ao ler os dados")
                }
            })

        },

        onSearchHelps4: function () {
            
            var url = "/sap/opu/odata/SAP/ZGWFI_REL_REMESSA_SRV/";
            var odataModel = new sap.ui.model.odata.ODataModel(url);
            var n = this;
            odataModel.read("/Materiais?", {
                success: function(e, t) {
                    var o = new sap.ui.model.json.JSONModel({
                        Results: e.results
                    });
                    n.getView().setModel(o, "SearchHelp");
                },
                error: function(e) {
                    console.log("Erro ao ler os dados")
                }
            })

        },

        onVariantsInitialized: function(oEvent) {
            var oViewModel;

            // keeps the search state
            this._aTableSearchState = [];

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
                shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
                shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
                tableNoDataText : this.getResourceBundle().getText("tableNoDataText")
            });
            this.setModel(oViewModel, "worklistView");
            this.oSmartVariantManagement = this.getView().byId("svm");
			this.oExpandedLabel = this.getView().byId("expandedLabel");
			this.oSnappedLabel = this.getView().byId("snappedLabel");
			this.oFilterBar = this.getView().byId("filterbar");
			this.oTable = this.getView().byId("table");

			this.oFilterBar.registerFetchData(this.fetchData);
			this.oFilterBar.registerApplyData(this.applyData);
			this.oFilterBar.registerGetFiltersWithValues(this.getFiltersWithValues);

			var oPersInfo = new PersonalizableInfo({
				type: "filterBar",
				keyName: "persistencyKey",
				dataSource: "",
				control: this.oFilterBar
			});
			this.oSmartVariantManagement.addPersonalizableControl(oPersInfo);
			this.oSmartVariantManagement.initialise(function () {}, this.oFilterBar);

        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onUpdateFinished : function (oEvent) {
            // update the worklist's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        onSearch : function (oEvent) {
            this.onFilterApplied();
        },
        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefresh : function () {
            var oTable = this.byId("treeTable");
            oTable.getBinding("rows").refresh();
        },

        onFilterApplied: function() {
            var arrayFilters  = new Array;
           
            var filterData    = new sap.ui.model.Filter("NFE_CREATIONDATE",     sap.ui.model.FilterOperator.EQ, this.getView().byId("DP1").getValue());

            for (let i = 0; i < this._oMultiInput.getTokens().length; i++) {
                var filterCliente = new sap.ui.model.Filter("BR_NFPARTNER",  sap.ui.model.FilterOperator.EQ, this._oMultiInput.getTokens()[i].mAggregations.tooltip);
                arrayFilters.push(filterCliente);
            }

            for (let i = 0; i < this._oMultiInput2.getTokens().length; i++) {
                var filterCentro  = new sap.ui.model.Filter("PLANT",  sap.ui.model.FilterOperator.EQ, this._oMultiInput2.getTokens()[i].mAggregations.tooltip);
                arrayFilters.push(filterCentro);
            }
            
            if (this.getView().byId("DP1").getValue() !== "") {
                arrayFilters.push(filterData);
            }

            for (let i = 0; i < this._oMultiInput3.getTokens().length; i++) {
                var filterNota    = new sap.ui.model.Filter("BR_NOTAFISCAL", sap.ui.model.FilterOperator.EQ, this._oMultiInput3.getTokens()[i].mAggregations.tooltip);
                arrayFilters.push(filterNota);
            }

            for (let i = 0; i < this._oMultiInput4.getTokens().length; i++) {
                var filterMat     = new sap.ui.model.Filter("MATERIAL", sap.ui.model.FilterOperator.EQ, this._oMultiInput4.getTokens()[i].mAggregations.tooltip);
                arrayFilters.push(filterMat);
            }


            if (arrayFilters.length == 0) {
                sap.m.MessageBox.error("Nenhum filtro informado");
                return;
            }


            var n = this;
       //    n.getView().byId("treeTable").bindRows({
       //        path : '/Remessas',
       //        filters: arrayFilters,
       //        parameters : {
       //         //   arrayNames: ['devolv_items'],
       //         //   countMode : 'Inline',
       //         suspended: true,

       // //        useServersideApplicationFilters: false,
       //         autoExpandMode:'Bundled',
       //         countMode: 'Inline',
       // //        operationMode:'Client',    
       //            treeAnnotationProperties : {
       //                hierarchyLevelFor :  'HierarchyLevel',
       //                hierarchyNodeFor : 'NodeID',
       //                hierarchyParentNodeFor : 'ParentNodeID',
       //                hierarchyDrillStateFor : 'DrillState'
       //            }
       //        }
       //    });
       //     n.onRefresh();  
            
         // var url = "/sap/opu/odata/SAP/ZGWFI_REL_REMESSA_SRV/";
         // var odataModel = new sap.ui.model.odata.ODataModel(url);
         //
         // odataModel.read("/Remessas", {
         //     filters: arrayFilters,
         //     success: function(e, t) {
         //         var o = new sap.ui.model.json.JSONModel({
         //             Results: e.results
         //         });
         //         if (e.results.length == 0) {
         //             sap.m.MessageBox.information("Nenhum registro encontrado");
         //             var o = new sap.ui.model.json.JSONModel({
         //                 Results: ""
         //             });
         //             n.getView().byId("treeTable").setModel(o)
         //             n.onRefresh();
         //         } else {
  
         //         }
         //     },
         //     error: function(e) {
         //         console.log("Erro ao ler os dados")
         //     }
         // })

        },


        
        onValueHelpCancelPress: function(oEvent) {
            this._oVHD.close();
        },

        onValueHelpOkPress: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this._oMultiInput.setTokens(aTokens);
			this._oVHD.close();
		},

        onValueHelpOkPress2: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this._oMultiInput2.setTokens(aTokens);
			this._oVHD.close();
		},

        onValueHelpOkPress3: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this._oMultiInput3.setTokens(aTokens);
			this._oVHD.close();
		},

        onValueHelpOkPress4: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this._oMultiInput4.setTokens(aTokens);
			this._oVHD.close();
		},

        onValueHelpRequest: function(oEvent) {
			
			this._oBasicSearchField = new SearchField();
			this.loadFragment({
				name: "zuiremessas.view.ValueHelpDialogFilterbar"
			}).then(function(oDialog) {
				var oFilterBar = oDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
				this._oVHD = oDialog;

				this.getView().addDependent(oDialog);

				// Set key fields for filtering in the Define Conditions Tab
				oDialog.setRangeKeyFields([{
					label: "cliente",
					key: "BR_NFPARTNER",
					type: "string",
					typeInstance: new TypeString({}, {
						maxLength: 7
					})
				}]);

				// Set Basic Search for FilterBar
		oFilterBar.setFilterBarExpanded(false);
		oFilterBar.setBasicSearch(this._oBasicSearchField);

		// Trigger filter bar search when the basic search is fired
		this._oBasicSearchField.attachSearch(function() {
			oFilterBar.search();
		});

		oDialog.getTableAsync().then(function (oTable) {

			oTable.setModel(this.oProductsModel);

			// For Desktop and tabled the default table is sap.ui.table.Table
			if (oTable.bindRows) {
				// Bind rows to the ODataModel and add columns
				oTable.bindAggregation("rows", {
					path: "/Clientes",
					events: {
						dataReceived: function() {
							oDialog.update();
						}
					}
				});

                var oColumn = new sap.ui.table.Column({
                    label: new sap.ui.commons.Label({text: "Cliente"}),
                    template: new sap.ui.commons.TextView().bindProperty("text", "BR_NFPARTNER"),
                    sortProperty: "BR_NFPARTNER",
                    filterProperty: "BR_NFPARTNER",
                });
            
                // Adicione a coluna à tabela
                oTable.addColumn(oColumn);

                var oColumn2 = new sap.ui.table.Column({
                    label: new sap.ui.commons.Label({text: "Nome do cliente"}),
                    template: new sap.ui.commons.TextView().bindProperty("text", "BR_NFPARTNERNAME"),
                    sortProperty: "BR_NFPARTNERNAME",
                    filterProperty: "BR_NFPARTNERNAME",
                });
            
                // Adicione a coluna à tabela
                oTable.addColumn(oColumn2);
		}
		}.bind(this));

		        oDialog.setTokens(this._oMultiInput.getTokens());
				oDialog.open();
			}.bind(this));
            
        }
        ,

        onValueHelpRequest2: function(oEvent) {
			
			this._oBasicSearchField = new SearchField();
			this.loadFragment({
				name: "zuiremessas.view.ValueHelpDialogFilterbar2"
			}).then(function(oDialog) {
				var oFilterBar = oDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
				this._oVHD = oDialog;

				this.getView().addDependent(oDialog);

				// Set key fields for filtering in the Define Conditions Tab
				oDialog.setRangeKeyFields([{
					label: "Centro",
					key: "CFOP",
					type: "string",
					typeInstance: new TypeString({}, {
						maxLength: 7
					})
				}]);

				// Set Basic Search for FilterBar
		oFilterBar.setFilterBarExpanded(false);
		oFilterBar.setBasicSearch(this._oBasicSearchField);

		// Trigger filter bar search when the basic search is fired
		this._oBasicSearchField.attachSearch(function() {
			oFilterBar.search();
		});

		oDialog.getTableAsync().then(function (oTable) {

			oTable.setModel(this.oProductsModel);

			// For Desktop and tabled the default table is sap.ui.table.Table
			if (oTable.bindRows) {
				// Bind rows to the ODataModel and add columns
				oTable.bindAggregation("rows", {
					path: "/Centros",
					events: {
						dataReceived: function() {
							oDialog.update();
						}
					}
				});
                
            var oColumn = new sap.ui.table.Column({
                label: new sap.ui.commons.Label({text: "Centro"}),
                template: new sap.ui.commons.TextView().bindProperty("text", "PLANT"),
                sortProperty: "PLANT",
                filterProperty: "PLANT",
            });
        
            // Adicione a coluna à tabela
            oTable.addColumn(oColumn);


            var oColumn2 = new sap.ui.table.Column({
                label: new sap.ui.commons.Label({text: "Nome do Centro"}),
                template: new sap.ui.commons.TextView().bindProperty("text", "PLANT_DESC"),
                sortProperty: "PLANT_DESC",
                filterProperty: "PLANT_DESC",
            });
        
            // Adicione a coluna à tabela
            oTable.addColumn(oColumn2);
		}
		}.bind(this));

		        oDialog.setTokens(this._oMultiInput2.getTokens());
				oDialog.open();
			}.bind(this));
            
        }
        ,


        onValueHelpRequest3: function(oEvent) {
			
			this._oBasicSearchField = new SearchField();
			this.loadFragment({
				name: "zuiremessas.view.ValueHelpDialogFilterbar3"
			}).then(function(oDialog) {
				var oFilterBar = oDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
				this._oVHD = oDialog;

				this.getView().addDependent(oDialog);

				// Set key fields for filtering in the Define Conditions Tab
				oDialog.setRangeKeyFields([{
					label: "Nota Fiscal",
					key: "BR_NOTAFISCAL",
					type: "string",
					typeInstance: new TypeString({}, {
						maxLength: 7
					})
				}]);

				// Set Basic Search for FilterBar
		oFilterBar.setFilterBarExpanded(false);
		oFilterBar.setBasicSearch(this._oBasicSearchField);

		// Trigger filter bar search when the basic search is fired
		this._oBasicSearchField.attachSearch(function() {
			oFilterBar.search();
		});

		oDialog.getTableAsync().then(function (oTable) {

			oTable.setModel(this.oProductsModel);

			// For Desktop and tabled the default table is sap.ui.table.Table
			if (oTable.bindRows) {
				// Bind rows to the ODataModel and add columns
				oTable.bindAggregation("rows", {
					path: "/Notas",
					events: {
						dataReceived: function() {
							oDialog.update();
						}
					}
				});

                var oColumn = new sap.ui.table.Column({
                    label: new sap.ui.commons.Label({text: "Nota Fiscal"}),
                    template: new sap.ui.commons.TextView().bindProperty("text", "CFOP"),
                    sortProperty: "CFOP",
                    filterProperty: "CFOP",
                });
            
                // Adicione a coluna à tabela
                oTable.addColumn(oColumn);
		}
		}.bind(this));

		        oDialog.setTokens(this._oMultiInput3.getTokens());
				oDialog.open();
			}.bind(this));
            
        }
        ,


        onValueHelpRequest4: function(oEvent) {
			
			this._oBasicSearchField = new SearchField();
			this.loadFragment({
				name: "zuiremessas.view.ValueHelpDialogFilterbar4"
			}).then(function(oDialog) {
				var oFilterBar = oDialog.getFilterBar(), oColumnProductCode, oColumnProductName;
				this._oVHD = oDialog;

				this.getView().addDependent(oDialog);

				// Set key fields for filtering in the Define Conditions Tab
				oDialog.setRangeKeyFields([{
					label: "Material",
					key: "MATERIAL",
					type: "string",
					typeInstance: new TypeString({}, {
						maxLength: 7
					})
				}]);

				// Set Basic Search for FilterBar
		oFilterBar.setFilterBarExpanded(false);
		oFilterBar.setBasicSearch(this._oBasicSearchField);

		// Trigger filter bar search when the basic search is fired
		this._oBasicSearchField.attachSearch(function() {
			oFilterBar.search();
		});

		oDialog.getTableAsync().then(function (oTable) {

			oTable.setModel(this.oProductsModel);

			// For Desktop and tabled the default table is sap.ui.table.Table
			if (oTable.bindRows) {
				// Bind rows to the ODataModel and add columns
				oTable.bindAggregation("rows", {
					path: "/Materiais",
					events: {
						dataReceived: function() {
							oDialog.update();
						}
					}
				});

                var oColumn = new sap.ui.table.Column({
                    label: new sap.ui.commons.Label({text: "Material"}),
                    template: new sap.ui.commons.TextView().bindProperty("text", "MATERIAL"),
                    sortProperty: "MATERIAL",
                    filterProperty: "MATERIAL",
                });
            
                // Adicione a coluna à tabela
                oTable.addColumn(oColumn);

                var oColumn2 = new sap.ui.table.Column({
                    label: new sap.ui.commons.Label({text: "Material"}),
                    template: new sap.ui.commons.TextView().bindProperty("text", "MATERIAL_DESC"),
                    sortProperty: "MATERIAL_DESC",
                    filterProperty: "MATERIAL_DESC",
                });
            
                // Adicione a coluna à tabela
                oTable.addColumn(oColumn2);

		}
		}.bind(this));

    	oDialog.setTokens(this._oMultiInput4.getTokens());
				oDialog.open();
			}.bind(this));
            
        },

        oncloseDialog: function(oEvent) {
            this._oVHD.close();
        }

    });
});
