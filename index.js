Object.fromXML = function( source, includeRoot ) {
    if( typeof source == 'string' )
    {
        try
        {
            if ( window.DOMParser )
                source = ( new DOMParser() ).parseFromString( source, "application/xml" );
            else if( window.ActiveXObject )
            {
                var xmlObject = new ActiveXObject( "Microsoft.XMLDOM" );
                xmlObject.async = false;
                xmlObject.loadXML( source );
                source = xmlObject;
                xmlObject = undefined;
            }
            else
                throw new Error( "Cannot find an XML parser!" );
        }
        catch( error )
        {
            return false;
        }
    }

    var result = {};

    if( source.nodeType == 9 )
        source = source.firstChild;
    if( !includeRoot )
        source = source.firstChild;

    while( source ) {
        if( source.childNodes.length ) {
            if( source.tagName in result ) {
                if( result[source.tagName].constructor != Array ) 
                    result[source.tagName] = [result[source.tagName]];
                result[source.tagName].push( Object.fromXML( source ) );
            }
            else 
                result[source.tagName] = Object.fromXML( source );
        } else if( source.tagName )
            result[source.tagName] = source.nodeValue;
        else if( !source.nextSibling ) {
            if( source.nodeValue.clean() != "" ) {
                result = source.nodeValue.clean();
            }
        }
        source = source.nextSibling;
    }
    return result;
};

String.prototype.clean = function() {
    var self = this;
    return this.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, "");
}