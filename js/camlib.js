((window)=>
{
    'use strict';
    /**dependancies
     * jquery
     * fabricjs 4.6
    */
    const { log, trace, error, warn, info, clear } = console;
    const btns = $(".btn").toArray();
    var debug = false;

    /* form variables */
    var _dynamicImage = $("#dynamicImage");
    var _exportSvg = $("#exportSvg");
    var _productStyle = $("#camProduct").text();
    var _productCharacter = ($("#camCharacteristics").text()) ? $("#camCharacteristics").text() : "NONE";
    var _productInventory = ()=>{ return JSON.parse($("#camInventory").val());} 
    const _svgText = $("._svgInput:text");
    const _alloySelect = $("._alloySelect").toArray();
    const _motifSelect = $("#motifInput");
    const _accentSelect = $("#accentInput");
    var _svgFile;
    var _svgAlloyImage;
    /* end form variables */

    /* canvas variables */
    const config ={ cnf:{ canvasWidth:100 ,canvasHeight:100 ,background:"rgba(231,245,249,0.8)",objectCaching:false,hoverCursor:"pointer" } };
    const colour = {"NONE":"#BABABA","AG":"#BABABA","9Y":"#E0B97F","9R":"#DDB8A9","9W":"#C0C0C0"};
    var canvas; 
    var serializer = new XMLSerializer();
    var doc, svgString, objs;
    const parser = new DOMParser();
    /* end canvas variables */

    const subAction = 
    {
        test:()=> $(btns[2]).click( ()=> warn(_productInventory()))
        ,toggleCanvas:()=> $(btns[3]).click(()=> $(".canvasHost").toggleClass("d-none"))  
        ,svgFileUrl:(name="MS016")=> { _svgFile = "./svg/".concat(name).concat(".svg"); return _svgFile; }
        ,imageFileUrl:(name="MS016")=> { _svgAlloyImage = "./images/".concat(name).concat(".png"); return _svgAlloyImage; }
        ,loadFabricSvg:()=>{}  
        ,loadNormalSvg:()=>{} 
        
        ,debugLog:()=> 
        {   
            let report = {};
            report.productStyle=_productStyle;
            report.productCharacter=_productCharacter;
            report.productInventory=_productInventory();
            report.svgString= "uncomment me!"; //svgString;

            if(debug){ log(JSON.stringify(report)); } 
        }
        ,drawSvg:()=>
        {
            canvas.clear();
            fabric.loadSVGFromString(svgString, function(objects, options) 
            {
              objs = fabric.util.groupSVGElements(objects, options);
              objs.set({selectable:false,objectCache:false});
              canvas.add(objs).renderAll();
              objs.moveTo(0);
              objs.center();
            });
        } 
        ,scaleFactor:(val)=>
        {
            val = (isNaN(val)) ? 2 : val; 
            canvas.zoomToPoint(new fabric.Point(canvas.width/2, canvas.height/2), val);
            subAction.drawImage();
        }
        ,drawImage:()=>
        {
            if(!svgString) return;

            let dim = 2000;
            var tmpCanvas = document.createElement('canvas');
            tmpCanvas.id="canvas";
            tmpCanvas.setAttribute("width",dim);
            tmpCanvas.setAttribute("height",dim);
            let ctx = tmpCanvas.getContext('2d');

            var im = new Image();
            im.src = "data:image/svg+xml,".concat(encodeURIComponent(canvas.toSVG()));
            //draw 
            im.onload = ()=>
            {
                ctx.drawImage(im, 0, 0, dim*window.devicePixelRatio, dim*window.devicePixelRatio); 
                $(_dynamicImage).attr("src",tmpCanvas.toDataURL());
                $(_exportSvg).attr("src","data:image/svg+xml,".concat(encodeURIComponent(canvas.toSVG())));
            };
        }
        ,alloySelector:(doc)=>
        {
            $(document).on("change",_alloySelect[0],(ev)=>
            {
                doc = parser.parseFromString(svgString,"image/svg+xml");
                doc.getElementById("shape").setAttribute("fill",colour[$(_alloySelect).val()]);
                svgString = serializer.serializeToString(doc);
                subAction.drawSvg();
                subAction.drawImage();
            })
        }

    };

    /* svg core functions */
    const camGroup =
    {
        PATHS:()=>
        {
            warn("PATHS: import all paths");
            warn(_productStyle);
            doc = parser.parseFromString(svgString,"image/svg+xml");
            var p = doc.getElementsByTagName("path");
            subAction.alloySelector(doc);
            subAction.scaleFactor(2);
            // p[0].setAttribute("fill","#f0f");
           
            // let x = doc.getElementById("shapeMark");
            // x.parentNode.removeChild(x);
            // let parent = x.parentNode;
            // parent.removeChild(x);
            
            svgString = serializer.serializeToString(doc);

            subAction.drawSvg();
            subAction.drawImage();
        }
        ,NONE:()=>
        {
            warn("no svg handler configured");
        }
    };
    
    /* method return object */
    let functions = ()=>
    {
        subAction.toggleCanvas();
        
        /* init canvas */
        fetch(subAction.svgFileUrl(_productStyle),{method:"GET"})
        .then(resp=> (resp.status === 200) ? resp.text() : resp.status)
        .then(d=> 
        {
            canvas = new fabric.Canvas("orderCanvas",config); 
            doc = parser.parseFromString(d,"image/svg+xml");
            svgString = serializer.serializeToString(doc);
            subAction.test();
            
            subAction.debugLog();
            subAction.drawSvg();
            subAction.drawImage();
  
            let action = camGroup["PATHS"];
            return action();
        });
    };
    
    /* assign method if undefined. global name: svgInput, call: svgInput.classic() */ 
    if(typeof(window.pantheonCanvas) === 'undefined'){ return window.pantheonCanvas = functions(); }

})(window);


/**
 * create new svg
 * import required elements
 * 
 */