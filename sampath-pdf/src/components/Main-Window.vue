<template>
  <div class="split-container">
    <div class="half-left">
      <div class="center-container" v-if="showButton" id="button-panel">
        <template>
          <v-btn @click="triggerFileInput" color="orange">
            Select document
            <v-icon right dark>mdi-cloud-upload</v-icon>
          </v-btn>
        </template>
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          @change="handleChange"
        />
      </div>



      <!-- canves -->
      <div  id="drop-zone" style="width:1000px; height: 100%;">
        <div v-for="item in items" :key="item.id"  ref="draggableContainer">

          <v-chip  @dragstart="initInteract(item.id,'sign',item.text)"  @mouseenter="enable(item.id)"
                   :id="item.id"
                   color="red"
                   text-color="white"
                   class="draggable p-3">
            {{item.text}}
          </v-chip>
        </div>

        <div>
          <canvas :id="'the-canvas'+ render"  style="width: 800px; height: 1000px;" v-for="render in TotPage" :key="render.id"></canvas>
        </div>
      </div> 


    </div>







    <div class="right-half">
      <div class="right-half-base-container">
        <h2 class="title">Settings</h2>

        <div>
          <h4 class="field-names">
            Document Name<span class="asterisk-text">*</span>
          </h4>
          <div class="name-show-block">
            <p class="show-pdf-name" id="show-pdf-name">
              {{ selectedFileName }}
            </p>
          </div>
        </div>

        <div>
          <h4 class="field-names">
            Place Holder<span class="asterisk-text">*</span>
          </h4>
          <div class="place-holder-show-block">
            <!-- <v-btn class="place-holder-btn" rounded da  rk>
              Signature
            </v-btn> -->

            <button class="signature-buttom-style" @click="addItem">
              Signature
            </button>
          </div>
        </div>

        <div class="field-names-buttons">
          <button class="save-btn-style">{{ saveAndShare }}</button>
          <button class="cancel-btn-style">Discard Changes</button>
          <button class="cancel-btn-style">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import packages here
import interact from "interactjs";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

export default {
  name: "mainWindow",
  components: {},

  //loacl variables here
  data() {
    return {
      items: [],
      visible: false,
      TotPage: 0,
      Pageindex: [],
      selectedFile: null,
      showButton: true,
      selectedFileName: "",
      saveAndShare: "Save & Share",
      showSignatureCard: false,
      startX: 0,
      startY: 0,
      points: [],
      isDrawing: false,
      canvas: null,
      context: null,
      // rules: [
      //   value => !!value || 'Required.',
      //   value => (value && value.length >= 3) || 'Min 3 characters',
      // ],
      //pdfUrl: "C:/Users/payme/Downloads/PayMedia_-_Git_Best_Practices.pdf",
    };
  },

  //mounted here

  //methods here
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    openFileInput() {
      // Trigger the click event on the hidden file input
      document.getElementById("fileInput").click();
      console.log("openFileInput");
    },

    addItem(){

      this.items.push({id:this.cardId++,text:this.name,type:'sign'})
      // var content = document.getElementById('pdfagent-1');

    },



    handleChange() {
      
      this.showButton = false;
      var component = this;

      var url = URL.createObjectURL(event.target.files[0]);

      console.log("url"+  url);

      // component.embedSrc = url + "#toolbar=0";
      component.visible = true;

      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      var loadingTask = pdfjsLib.getDocument(url);
      console.log("loadingTask"+loadingTask)
      loadingTask.promise.then(
        function (pdf) {
          // Fetch the first page

          var totalpages = pdf.numPages;
          component.TotPage = totalpages;

          console.log("pdf numPages" + totalpages);

          for (var x = 1; x < totalpages; x++) {
            component.Pageindex.push({ pageIndex: x });
          }

          if (totalpages > 1) {
            component.Pageindex.forEach((element) => {
              pdf.getPage(element.pageIndex).then(function (page) {
                console.log("Page loaded",element.pageIndex);

                var scale = 1.5;
                var viewport = page.getViewport({ scale: scale });

                console.log('Page viewport:', viewport);

                // Prepare canvas using PDF page dimensions
                var canvas = document.getElementById("the-canvas"+element.pageIndex);

                if(canvas){
                  var context = canvas.getContext("2d");
                  canvas.height = viewport.height;
                  canvas.width = viewport.width;
                  console.log("canvas thiye : ",canvas);
                }
                else{
                  console.log("canvas not thiye : ",canvas);
                }

                // Render PDF page into canvas context
                var renderContext = {
                  canvasContext: context,
                  viewport: viewport,
                };
                var renderTask = page.render(renderContext);
                renderTask.promise.then(function () {
                  console.log("Page rendered");
                });
              });
            });
          } else {
            console.log("cccccccccccc");

            var pagenumber = 1;
            pdf.getPage(pagenumber).then(function (page) {
              console.log("Page loaded");

              var scale = 1.5;
              var viewport = page.getViewport({ scale: scale });

              // Prepare canvas using PDF page dimensions
              var canvas = document.getElementById("the-canvas1");
              if(canvas){
                var context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;
              }

              // Render PDF page into canvas context
              var renderContext = {
                canvasContext: context,
                viewport: viewport,
              };
              var renderTask = page.render(renderContext);
              renderTask.promise.then(function () {
                console.log("Page rendered");
              });
            });
          }
        },
        function (reason) {
          // PDF loading error
          console.error(reason);
        }
      );
    },

    mousedown(e) {
      var vm = this;
      var rect = vm.canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      vm.isDrawing = true;
      vm.startX = x;
      vm.startY = y;
      vm.points.push({
        x: x,
        y: y,
      });
    },

    mousemove(e) {
      var vm = this;
      var rect = vm.canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      if (vm.isDrawing) {
        vm.context.beginPath();
        vm.context.moveTo(vm.startX, vm.startY);
        vm.context.lineTo(x, y);
        vm.context.lineWidth = 2;
        vm.context.lineCap = "round";
        vm.context.strokeStyle = "rgba(0,0,0,1)";
        vm.context.fillStyle = "#800";
        vm.context.stroke();

        vm.startX = x;
        vm.startY = y;

        vm.points.push({
          x: x,
          y: y,
        });
      }
    },

    mouseup() {
      var vm = this;
      vm.isDrawing = false;
      if (vm.points.length > 0) {
        localStorage["points"] = JSON.stringify(vm.points);
      }
    },

    createSignatureCard() {},
  },
  mounted() {
    var vm = this;
    vm.canvas = vm.$refs.canvas;

  },

initInteract: function (id,type,Text) {

      var component = this
      // var content = document.getElementById('pdfview-1')
      let selector = document.getElementById(id);
      const position = { x: 0, y: 0 }
    console.log('drag start')

      interact(selector).draggable({

        inertia: true,

        modifiers: [
          interact.modifiers.restrict({
            restriction: '.drop-zone',
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }

          })
        ],

        listeners: {
          start (event) {
            event.draggable=true
            console.log(event.type, event.target)
          },
          end (event) {
            console.log(event.type, event.target.id)
            console.log("item id: "+ id, "X Cordinate: "+position.x,"Y Cordinate: "+position.y, "type:"+type);

            if(type == 'sign'){
              console.log('sign')
              for (var i = 0; i < component.signCoordinate.length; i++) {
                  if (component.signCoordinate[i]['id'] == event.target.id) {
                    console.log('duplicate id')
                    component.signCoordinate.splice(component.signCoordinate[i]['id'], 1);

                  }
                }
                component.signCoordinate.push({id:event.target.id,Xcord:position.x,Ycord:position.y,text:Text,type:type})

            }else if(type == 'checkbox'){
              console.log('check')
              for (var x = 0; x < component.checkbxCoordinate.length; x++) {
                if (component.checkbxCoordinate[x]['id'] == event.target.id) {
                  console.log('duplicate id')
                  component.checkbxCoordinate.splice(component.checkbxCoordinate[x]['id'], 1);

                }
              }
              component.checkbxCoordinate.push({id:event.target.id,Xcord:position.x,Ycord:position.y,text:Text,type:type})
            }else{
              console.log('input')
              for (var y = 0; y < component.inputCoordinate.length; y++) {
                if (component.inputCoordinate[y]['id'] == event.target.id) {
                  console.log('duplicate id')
                  component.inputCoordinate.splice(component.inputCoordinate[y]['id'], 1);

                }
              }
              component.inputCoordinate.push({id:event.target.id,Xcord:position.x,Ycord:position.y,text:Text,type:type})
            }

          },

          move (event) {
            position.x += event.dx
            position.y += event.dy

            // content.insertBefore(id, content.childNodes[0])
            event.target.style.transform =
                `translate(${position.x}px, ${position.y}px)`
          },
        }
      })

    },



};
</script>

<style>
.center-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* 100% of the viewport height */
}

.split-container {
  display: flex;
  height: flex;
  height: 100vh;
  align-items: center; /* 100% of the viewport height */
}

.half-left {
  background-color: #f0f0f0;
  width: 65%;
  height: 100%;
  overflow-y: auto !important;
}

.right-half {
  background-color: white;
  width: 35%;
  height: 100vh;
  overflow: hidden;
}

.canvas-container {
  height: 100vh; /* Set a fixed height for the container */
  overflow: auto;
  width: 100%; /* Add scrollbar when content overflows */
}

.title {
  text-align: center;
  color: #757575;
  font-family: "Metropolis-Regular";
}

.right-half-base-container {
  padding: 10px;
  border-radius: 20px;
  margin: 20px;
  background: #fef8f2;
  height: 90vh;
}

.asterisk-text {
  color: red;
}

.field-names {
  font-family: "Metropolis-Regular";
  margin: 30px 20px 10px 10px;
}

.field-names-buttons {
  font-family: "Metropolis-Regular";
  margin: 70px 0px 10px 0px;
}

.name-show-block {
  font-family: "Metropolis-Regular";
  width: 90%;
  height: 60px;
  background: white;
  border-radius: 10px;
  margin: 0px 20px 10px 10px;
  border: #cccccc 1px solid;
  overflow: hidden;
}

.show-pdf-name {
  font-family: "Metropolis-Regular";
  text-align: center;
  margin: 15px 0px;
  color: red;
  justify-content: center;
}

.canvas-style {
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 62vw;
}

.place-holder-show-block {
  height: 50px;
}

.signature-buttom-style {
  background-color: blue;
  font-family: "Metropolis-Bold";
  color: white;
  border: none;
  border-radius: 10px;
  padding: 5px;
  height: 70px;
  width: 90%;
  margin: 10px;
  box-shadow: 0 1px 2px darkslategray;
}

.save-btn-style {
  background-color: #f78020;
  font-family: "Metropolis-Bold";
  color: white;
  border: none;
  border-radius: 20px;
  padding: 5px;
  height: 40px;
  width: 90%;
  margin: 10px;
  box-shadow: 0 1px 4px rgb(117, 94, 58);
}

.cancel-btn-style {
  background-color: white;
  font-family: "Metropolis-Bold";
  color: #f78020;
  border: solid 2px #f78020;
  border-radius: 20px;
  padding: 5px;
  height: 40px;
  width: 90%;
  margin: 10px;
  box-shadow: 0 1px 4px rgb(117, 94, 58);
}

.signature-card {
  /* Add your styling for the v-card here */
  margin: 10px;
  /* Add any other styles you need */
}
</style>
