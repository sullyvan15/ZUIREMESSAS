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
    var bSelected;
    var arrayFiltersExcel  = new Array;
    var url = "/sap/opu/odata/SAP/ZGWFI_REL_REMESSA_SRV/";
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
         //   this.getView().bindElement("/Remessas");
       this.onSearchHelps();
       this.onSearchHelps2();
       this.onSearchHelps3();
       this.onSearchHelps4();
       this.onVariantsInitialized();


       var oMultiInput, oMultiInputWithSuggestions;
	//	// Value Help Dialog standard use case with filter bar without filter suggestions
		oMultiInput = this.byId("fieldBarCliente");
       var inputCentro = this.byId("fieldBarCentro");
       var inputNota = this.byId("fieldBarNota");
       var inputMaterial = this.byId("fieldBarMaterial");
       var inputCFOP = this.byId("fieldBarCFOP");
         var inputCFOPdevolv = this.byId("fieldBarCfopDevolv");
	//	oMultiInput.addValidator(this._onMultiInputValidate);
    //    inputCentro.addValidator(this._onMultiInputValidate);
    //    inputNota.addValidator(this._onMultiInputValidate);
    //    inputMaterial.addValidator(this._onMultiInputValidate);
        
		//oMultiInput.setTokens(this._getDefaultTokens());
		this._oMultiInput = oMultiInput;
        this._inputCentro = inputCentro;
        this._inputNota = inputNota;
        this._inputMaterial = inputMaterial;
        this._inputCFOP = inputCFOP;
        this._inputCFOPdevolv = inputCFOPdevolv;
		// Whitespace
	

        var oToken = new sap.m.Token({
            key: "1", // Substitua "1" pela chave do seu valor inicial
            text: "5663AA" // Substitua "Initial Value" pelo texto do seu valor inicial
        });

        // Adicione o token ao MultiInput
        this._inputCFOP.addToken(oToken);


        // Crie um novo token
        var oToken = new sap.m.Token({
            key: "1", // Substitua "1" pela chave do seu valor inicial
            text: "2664AA" // Substitua "Initial Value" pelo texto do seu valor inicial
        });

        // Adicione o token ao MultiInput
        this._inputCFOPdevolv.addToken(oToken);

        },

        onSearchHelps: function () {

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

        onAfterRendering: function() {
            var oSmartTable = this.byId("smartTreeTable");
            var oTable = oSmartTable.getTable();
        
            oTable.attachEventOnce("updateFinished", function() {
                for (var i = 0; i < oTable.getColumns().length; i++) {
                    oTable.autoResizeColumn(i);
                }
            });
        },

        onSearchHelps2: function () {
            
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

        onBeforeExport: function (oEvt) {
            var oExport = oEvt.getParameter("exportSettings");
            oExport.dataSource.count = this.byId("hierTable_org_hier").getBinding("rows").getLength();
        },
   
    onVariantsInitialized: function(oEvent) {
        

        this.oSmartVariantManagement = this.getView().byId("svm");
        this.oExpandedLabel = this.getView().byId("expandedLabel");
        this.oSnappedLabel = this.getView().byId("snappedLabel");
        this.oFilterBar = this.getView().byId("filterbar");
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


        onSearchHelps4: function () {
            
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

        onRefresh : function () {
            var oTable = this.byId("hierTable_org_hier");
           oTable.getBinding("rows").refresh();
        },

        onSearch: function() {
            var arrayFilters  = [];
     
            for (let i = 0; i < this._oMultiInput.getTokens().length; i++) {
                var filterCliente = new sap.ui.model.Filter("BR_NFPARTNER",  sap.ui.model.FilterOperator.EQ, this._oMultiInput.getTokens()[i].mAggregations.tooltip);
                arrayFilters.push(filterCliente);
            }

            for (let i = 0; i < this._inputCentro.getTokens().length; i++) {
                var filterCentro  = new sap.ui.model.Filter("PLANT",  sap.ui.model.FilterOperator.EQ, this._inputCentro.getTokens()[i].mAggregations.tooltip);
                arrayFilters.push(filterCentro);
            }
            
            var convData2 = this.getView().byId("DP2").getValue().split(".")[2] + this.getView().byId("DP2").getValue().split(".")[1] + this.getView().byId("DP2").getValue().split(".")[0];
            var convData1 = this.getView().byId("DP1").getValue().split(".")[2] + this.getView().byId("DP1").getValue().split(".")[1] + this.getView().byId("DP1").getValue().split(".")[0];
           //var convData1 = "20200101"
           //var convData2 = "20241231"
            var filterData    = new sap.ui.model.Filter("NFE_CREATIONDATE", sap.ui.model.FilterOperator.BT, convData1, convData2);
            arrayFilters.push(filterData);
//
                   for (let i = 0; i < this._inputNota.getTokens().length; i++) {
                       filterNota    = new sap.ui.model.Filter("BR_NOTAFISCAL", sap.ui.model.FilterOperator.EQ, this._inputNota.getTokens()[i].mAggregations.tooltip);
                       arrayFilters.push(filterNota);
                   }
//
           for (let i = 0; i < this._inputMaterial.getTokens().length; i++) {
               var filterMat     = new sap.ui.model.Filter("MATERIAL", sap.ui.model.FilterOperator.EQ, this._inputMaterial.getTokens()[i].mProperties.text);
               arrayFilters.push(filterMat);
           }

        for (let i = 0; i < this._inputCFOP.getTokens().length; i++) {
            var filtercfop     = new sap.ui.model.Filter("CFOP", sap.ui.model.FilterOperator.EQ, this._inputCFOP.getTokens()[i].mProperties.text);
            arrayFilters.push(filtercfop);
        }

          for (let i = 0; i < this._inputCFOPdevolv.getTokens().length; i++) {
              filtercfop     = new sap.ui.model.Filter("Devolv_CFOP", sap.ui.model.FilterOperator.EQ, this._inputCFOP.getTokens()[i].mProperties.text);
              arrayFilters.push(filtercfop);
          }
         
          var checkbox = this.getView().byId("itensCancelados").getSelected() === true ? "" : "X";
            var filterCancelados     = new sap.ui.model.Filter("checkbox", sap.ui.model.FilterOperator.EQ, checkbox);
         arrayFilters.push(filterCancelados);

    
              if (this.getView().byId("DP2").getValue() === "" || this.getView().byId("DP1").getValue() === "" || this._inputCFOP.getTokens().length === 0 || this._inputCFOP.getTokens().length === 0) {
                  sap.m.MessageToast.show("Preencha todos os campos obrigatórios");  
                return
              }

            this.filters = arrayFilters;
            var n = this;
            this.getView().byId("hierTable_org_hier").bindRows({
                filters: arrayFilters,
                path : '/Remessas',
              
                parameters : {
                 //   arrayNames: ['devolv_items'],
                 //   countMode : 'Inline',
                //suspended: true,
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
			this._inputCentro.setTokens(aTokens);
			this._oVHD.close();
		},

        onValueHelpOkPress3: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this._inputNota.setTokens(aTokens);
			this._oVHD.close();
		},

        onValueHelpOkPress4: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this._inputMaterial.setTokens(aTokens);
			this._oVHD.close();
		},

        onValueHelpOkPress5: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this._inputCFOP.setTokens(aTokens);
			this._oVHD.close();
		},

        onValueHelpOkPress6: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this._inputCFOPdevolv.setTokens(aTokens);
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

		        oDialog.setTokens(this._inputCentro.getTokens());
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

		        oDialog.setTokens(this._inputNota.getTokens());
				oDialog.open();
			}.bind(this));
            
        }
        ,


        onValueHelpRequest5: function(oEvent) {
			
			this._oBasicSearchField = new SearchField();
			this.loadFragment({
				name: "zuiremessas.view.ValueHelpDialogFilterbar5"
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
                    label: new sap.ui.commons.Label({text: ""}),
                    template: new sap.ui.commons.TextView().bindProperty("text", "CFOP"),
                    sortProperty: "CFOP",
                    filterProperty: "CFOP",
                });
            
                // Adicione a coluna à tabela
                oTable.addColumn(oColumn);
		}
		}.bind(this));

		        oDialog.setTokens(this._inputCFOP.getTokens());
				oDialog.open();
			}.bind(this));
            
        },
        onValueHelpRequest6: function(oEvent) {
			
			this._oBasicSearchField = new SearchField();
			this.loadFragment({
				name: "zuiremessas.view.ValueHelpDialogFilterbar6"
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
                    label: new sap.ui.commons.Label({text: ""}),
                    template: new sap.ui.commons.TextView().bindProperty("text", "CFOP"),
                    sortProperty: "CFOP",
                    filterProperty: "CFOP",
                });
            
                // Adicione a coluna à tabela
                oTable.addColumn(oColumn);
		}
		}.bind(this));

		        oDialog.setTokens(this._inputCFOPdevolv.getTokens());
				oDialog.open();
			}.bind(this));
            
        },

        oncloseDialog: function(oEvent) {
            this._oVHD.close();
        },

        


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

    	oDialog.setTokens(this._inputMaterial.getTokens());
				oDialog.open();
			}.bind(this));
            
        },




    });




    
});
