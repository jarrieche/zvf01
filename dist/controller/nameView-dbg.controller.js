sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment"

],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, MessageToast, MessageBox, Fragment) {
		"use strict";

		return Controller.extend("com.vf01.off.zvf01offline.controller.nameView", {
			onInit: function () {

			},
			sincronizar: function () {
				var thes = this;
				var oModelData = this.getView().getModel("data");
				var urlvbeln = "/sap/opu/odata/sap/Z_OD_FIORI_SD_SRV/DocComercial_SHSet";

				$.ajax({
					url: urlvbeln,
					type: "GET",
					dataType: "json",
					contentType: "application/json; charset=utf-8",

					success: function (data) {
						oModelData.setProperty("/DocComercial", data.d.results);
						var local = data.d.results;
						
						localStorage.setItem('DocComercial', JSON.stringify(local));
					},
					error: function (error) {
						var objectViewModel = that.getModel("objectView");
						//console.log("/dhola ", error);
						reject(error);
					}
				});
			},
			_readOdataV2: function (modelo, metodo, filtro, orden) {
				var that = this;
				var method = "/" + metodo;
				return new Promise(function (fnResolve, fnReject) {
					that.getView().getModel(modelo).read(method,
						{
							filters: filtro,
							sorters: orden,
							success: function (oData, oResponse) {
								//var response = oData.results;
								////console.log("oData",oData)
								////console.log("oResponse",oResponse)
								fnResolve(oData);
							},
							error: function (error, status, err) {
								//sap.ui.core.BusyIndicator.hide();
								fnReject(new Error(error.message));
							}
						});
				});
			},
			_posSap: function (aData) {
				var that = this;
				return new Promise(function (fnResolve, fnReject) {
					that.getView().getModel("originModel").create("/VF01Set", aData,
						{
							parameters:{ groupId:"batchCreate"},
							success: function (oData, oResponse) {
								////console.log("oData",oData)
								////console.log("oResponse",oResponse)
								fnResolve(oResponse);
							},
							error: function (oError) {

								fnReject(new Error(oError.message));
							}
						});
				});
			},
			onEnviar: function () {
				var that = this;
                var  arrayFacturas=[];
				var originModel = that.oView.getModel("originModel");
				////console.log("originModel", originModel);
				var modelo = "originModel";
				var metodo = "VF01Set";
				/*that._readOdataV2(modelo, metodo).then(function (dataRecibida) {
					//console.log("dataRecibidaV2--> ",dataRecibida)
				});*/
                arrayFacturas = JSON.parse(localStorage.getItem("Facturas"));
				//=== comparacyon
				//= asygnay
				if(!localStorage.getItem("Facturas")){
					MessageBox.error("No hay actividades por enviar", {
						icon: MessageBox.Icon.ERROR,
						title: "Error"
					});
					return;
				}
				//originModel.setData([]);
				var aDeferredGroup = originModel.getDeferredGroups().push("batchCreate");
				originModel.setDeferredGroups(aDeferredGroup);
				originModel.setUseBatch(true);
				var mParameters = {groupId:"batchCreate"};
				arrayFacturas.forEach(element => {
				originModel.create("/VF01Set",element, mParameters);
				});

				originModel.submitChanges({
					success: function(data){
						localStorage.removeItem("Facturas");
						//console.log(data);
					},
					error: function(e){
						console.log(e);
					}
				});
							
			},
			guardar: function (oEvent) {
				var arrayFacturas=[];
				var that = this;
				var vbeln = this.getView().byId('vbeln').getValue();
				// var vkorg = this.getView().byId('vkorg').getValue();
				// var vtweg = this.getView().byId('vtweg').getValue();
				// var spart = this.getView().byId('spart').getValue();
				// var ktabg = this.getView().byId('Ktabg').getDateValue();
				// var Ktaen = this.getView().byId('Ktaen').getDateValue();
				// var ktext = this.getView().byId('Ktext').getValue();
				// var Ktaar = this.getView().byId('Ktaar').getValue();
				// var Vkbur = this.getView().byId('Vkbur').getValue();
				// var Vkgrp = this.getView().byId('Vkgrp').getValue();
				// var Kunnr = this.getView().byId('Kunnr').getValue();
				// var Ktagr = this.getView().byId('Ktagr').getValue();
				// var Ktast = this.getView().byId('Ktast').getValue();
				// var ktabgDate = moment(ktabg).format('YYYY-MM-DD');
				// var KtabtTime = moment(ktabg).format('HH:mm:ss');
				// var KtaenDate = moment(Ktaen).format('YYYY-MM-DD');
				// var KtaenTime = moment(Ktaen).format('HH:mm:ss');
				var array = {
					'RefDoc': vbeln		
					
				};
				//arrayFacturas.push(array);				
				if (localStorage.getItem('Facturas') !== undefined && localStorage.getItem('Facturas')) {
					arrayFacturas = JSON.parse(localStorage.getItem("Facturas"));
				}
				arrayFacturas.push(array);
				localStorage.setItem("Facturas", JSON.stringify(arrayFacturas));
				MessageBox.success("Los datos se han guardado..", {
					icon: MessageBox.Icon.success,
					title: "Proceso Exitoso",
					// onClose:function(){
					// 	that.byId("vkorg").setValue("");
					// 	that.byId("vtweg").setValue("");
					// 	that.byId("spart").setValue("");
					// 	that.byId("Ktaar").setValue("");
					// 	that.byId("Vkbur").setValue("");
					// 	that.byId("Vkgrp").setValue("");
					// 	that.byId("vbeln").setValue("");
					// 	that.byId("Ktext").setValue("");
					// 	that.byId("Ktabg").setValue("");
					// 	that.byId("Ktaen").setValue("");
					// 	that.byId("Kunnr").setValue("");
					// 	that.byId("Ktagr").setValue("");
					// 	that.byId("Ktast").setValue("");
					// }
				});
				
			},			
			
			getVbeln: function (oEvent) {
				var that = this;
				var sInputValue2 = oEvent.getSource().getValue();

				this.inputId = oEvent.getSource().getId();
				//1.-SYYNCRO
				
				//LEER LOCALSTORAGE				
				//LEER ENTAD DEL LOCAL STORAGE ESPECA PARA ESTE MODAL
				var varAuxLocalStorage = localStorage.getItem('DocComercial');
				var objLocalStorage = JSON.parse(varAuxLocalStorage);
				//CREAMOS UN MODELO JSON
				var auxModeloDocComercial = new sap.ui.model.json.JSONModel(objLocalStorage);
				
				
				//SETMODEL DE DATOS
				that.getView().setModel(auxModeloDocComercial, "DocumentosComerciales");
				sap.ui.getCore().setModel(auxModeloDocComercial, "DocumentosComerciales");


				var kamiModel = that.getView().getModel("DocumentosComerciales");
				//ABROS MODAL
				if (!this._valueBusVbeln) {
					
					this._valueBusVbeln = sap.ui.xmlfragment(
						"com.vf01.off.zvf01offline.view.PopVbeln",
						this
					);
					this._valueBusVbeln.setModel(kamiModel);
					this.getView().addDependent(this._valueBusVbeln);
				}
				
				this._valueBusVbeln.open();			

				
			},
			//busqueda vbeln
			busVbeln: function (evt) {
				var sValue = evt.getParameter("value");
				var oFilter = new Filter(
					"Vbeln",
					sap.ui.model.FilterOperator.Contains, sValue
				);
				evt.getSource().getBinding("items").filter([oFilter]);
			},
			busVbelnClose: function (evt) {
				var oSelectedItem = evt.getParameter("selectedItem");
				if (oSelectedItem) {
					var productCepa = this.byId(this.inputId);
					productCepa.setValue(oSelectedItem.getTitle());
					var dataModelDoctos = this.getView().getModel("data").oData.DocVtasCont;
					var docto= dataModelDoctos.filter(e=> e.Vbeln === oSelectedItem.getTitle());
					// var vkorg=this.byId("vkorg");
					// var vtweg=this.byId("vtweg");
					// var spart=this.byId("spart");
					// var Ktaar=this.byId("Ktaar");
					// var Vkbur=this.byId("Vkbur");
					// var Vkgrp=this.byId("Vkgrp");
					// var Kunnr=this.byId("Kunnr");
					// vkorg.setValue(docto[0].Vkorg);
					// vtweg.setValue(docto[0].Vtweg);
					// spart.setValue(docto[0].Spart);
					// Ktaar.setValue(docto[0].Ktaar);
					// Vkbur.setValue(docto[0].Vkbur);
					// Vkgrp.setValue(docto[0].Vkgrp);
					// Kunnr.setValue(docto[0].Kunnr);
				}
				evt.getSource().getBinding("items").filter([]);
			},
			getRouter: function () {

				return sap.ui.core.UIComponent.getRouterFor(this);

			}
		});
	});
