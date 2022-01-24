((window)=>
{
    'use strict';
    /**dependancies
     * jquery
     * fabricjs 4.6
    */
    const { log, trace, error, warn, info, clear } = console;
    /* form variables */
    const productStyle = $("#camProduct").text();
    const productCharacter = JSON.parse($("#camCharacteristics").text());
    const productInventory = JSON.parse($("#camInventory").text());
    const _svgSelect = $("._svgInput:text");
    const _alloySelect = $("#alloyInput");
    const _motifSelect = $("#motifInput");
    const _accentSelect = $("#accentInput");
    /* end form variables */

    /* canvas variables */

    /* end canvas variables */

    const subAction = 
    {
                
    };
    
    const camGroup =
    {
        PATHS:()=>
        {
            
        }
        ,NONE:()=>
        {
            alert("no svg handler configured");
        }
    };
    
    /* method return object */
    log(productStyle);
    let functions = (camStyle = "NONE")=>
    {
        let action = camGroup[camStyle];
        return action();
//        var result = 
//        {
//            classic:()=>{return "classic names"; }
//            ,retro:()=>{return "retro names"; }
//        };
//        return result;
    };
    
    /* assign method if undefined. global name: svgInput, call: svgInput.classic() */ 
    if(typeof(window.svgInput) === 'undefined'){ window.svgInput = functions(); }

})(window);
