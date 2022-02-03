((window)=>
{
    'use strict';
    /**dependancies
     * jquery
     * fabricjs 4.6
    */
    const { log, trace, error, warn, info, clear } = console;
    const btns = $(".btn").toArray();
    /* form variables */
    var debug = false;

    var _productStyle = $("#camProduct").text();
    var _productCharacter = ($("#camCharacteristics").text()) ? $("#camCharacteristics").text() : "NONE";
    var productInventory = JSON.parse($("#camInventory").text()); 
    const _svgText = $("._svgInput:text");
    const _alloySelect = $("._alloySelect")[0];
    const _motifSelect = $("#motifInput");
    const _accentSelect = $("#accentInput");
    var _svgFile;
    var _svgAlloyImage;
    /* end form variables */

    /* canvas variables */
    const config ={ cnf:{ canvasWidth:300 ,canvasHeight:300 ,background:"rgba(231,245,249,0.8)",objectCaching:false,hoverCursor:"pointer" } };
    const colour = {"NONE":"#BABABA","AG":"#BABABA","9Y":"#E0B97F","9R":"#DDB8A9","9W":"#C0C0C0"};
    var canvas; 
    var serializer = new XMLSerializer();
    var doc, svgString, objs;
    const parser = new DOMParser();
    /* end canvas variables */

    const subAction = 
    {
        toggleCanvas:()=> $(btns[3]).click(()=> $(".canvasHost").toggleClass("d-none"))  
        ,svgFileUrl:(name="MS016")=> { _svgFile = "./svg/".concat(name).concat(".svg"); return _svgFile; }
        ,imageFileUrl:(name="MS016")=> { _svgAlloyImage = "./images/".concat(name).concat(".png"); return _svgAlloyImage; }
        ,loadFabricSvg:()=>{}  
        ,loadNormalSvg:()=>{} 
        ,test:()=> $(btns[0]).click( ()=> subAction.drawImage())  //log( new XMLSerializer().serializeToString( $("#svgString").attr("src")));
        ,debugLog:()=> 
        {   
            let report = {};
            report.productStyle=_productStyle;
            report.productCharacter=_productCharacter;
            report.productInventory=productInventory;
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
            im.onload = ()=>{ctx.drawImage(im, 0, 0, dim*window.devicePixelRatio, dim*window.devicePixelRatio); $("#dynamicImage").attr("src",tmpCanvas.toDataURL());}; 
        }
        ,alloySelector:(doc)=>
        {
            $(document).on("change",_alloySelect,(ev)=>
            {
                doc = parser.parseFromString(svgString,"image/svg+xml");
                doc.getElementById("shape").setAttribute("fill",colour[$(_alloySelect).val()]); //colour[$(ev.target).val()
                log($(ev.target).val());
                svgString = serializer.serializeToString(doc);
                subAction.drawSvg();
                subAction.drawImage();
                log(canvas.toSVG());
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

            // p[0].setAttribute("fill","#f0f");
           
            // let x = doc.getElementById("shapeMark");
            // x.parentNode.removeChild(x);
            // let parent = x.parentNode;
            // parent.removeChild(x);
            
            svgString = serializer.serializeToString(doc);

            // subAction.drawSvg();
            // subAction.drawImage();
        }
        ,NONE:()=>
        {
            warn("no svg handler configured");
        }
    };
    
    /* method return object */
    let functions = (camStyle = "NONE")=>
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
            log(svgString);
            subAction.test();
            
            subAction.debugLog();
            subAction.drawSvg();
            subAction.drawImage();
            subAction.scaleFactor(3);
            
            let action = camGroup[_productCharacter];
           
            return action();
        });

        // return action();
    };
    
    /* assign method if undefined. global name: svgInput, call: svgInput.classic() */ 
    if(typeof(window.svgInput) === 'undefined'){ window.svgInput = functions(); }

})(window);


/**
 * create new svg
 * import required elements
 * 
 */