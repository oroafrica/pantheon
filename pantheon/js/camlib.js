((window)=>
{
    'use strict';
    /**dependancies
     * jquery
     * fabricjs 4.6
    */
    const { log, trace, error, warn, info, clear } = console;

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
