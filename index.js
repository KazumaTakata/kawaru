

function h(type, props, ...child){
  let children = child
  if (children.length === 1){
    children = children[0]
  }
  return { type, props, child: children }
}


function updateDom(parentNode, CurrentNode, currVDOM, prevVDOM){

  if( currVDOM.type !== prevVDOM.type){
    CurrentNode.remove()
    let Node = document.createElement( currVDOM.type )
    parentNode.appendChild(Node)
    currVDOM.child.map( (chVDOM) => {
      updateDom( Node, null, chVDOM, null )
    })
  } else {

    if (typeof currVDOM.child === "string"){

      if (currVDOM.child !== prevVDOM.child){
        CurrentNode.textContent = currVDOM.child
      }

    } else if ( Array.isArray(currVDOM.child) ) {

      let currKeysSet = new Set( currVDOM.child.map( ch => {return ch.key} ) )
      let prevKeys = prevVDOM.child.map( ch => { return ch.key } )
      let deletedKeys = prevKeys.filter( key => currKeysSet.has(key) )
      

      currVDOM.child.map( (chVDOM, index) => {
        updateDom( CurrentNode, CurrentNode.childNodes[index], chVDOM, prevVDOM.child[index] )
      } )

    }
  }
}


function callback(){
  console.log("callback")
  let prevVDOM = Object.assign({}, view())
  state.text1 = "text22222"
  let currVDOM = Object.assign({}, view())
  console.log(prevVDOM)
  console.log(currVDOM)

  let rootDom = document.getElementById("main")

  updateDom(rootDom, rootDom.childNodes[0], currVDOM, prevVDOM)
}


let state = { text1: "text1111" }

function view(){
  return  <ul id="cool" className="foo" onClick={callback}>
            <li>{state.text1}</li>
            <li>text2</li>
            <li>text3</li>
          </ul>
}

function manipulateDom(el , vdom){
  let Node = document.createElement(vdom.type)
  if (vdom.props !== null){
  Object.keys(vdom.props).map( (attr) => {
    if ( attr === "className" ){
      Node.setAttribute( "class", vdom.props[attr] )
    }
    else if (attr.startsWith("on")){
      let eventKind = attr.split("on")[1].toLowerCase()
      Node.addEventListener(eventKind, vdom.props[attr])
    } else {
      Node.setAttribute( attr, vdom.props[attr] )
    }
  } )
  }
  if( typeof vdom.child === "string"){

    let textNode = document.createTextNode(vdom.child)
    Node.appendChild(textNode)
    el.appendChild(Node)
  } else {

    el.appendChild(Node)
    vdom.child.map( (vd) => {
        manipulateDom(Node, vd)
    })

  }
}
//
// class One {
//
// 	constructor(){
//     	 this.dd = "o"
// 		   this.dde = "fe"
//     }
//
// 	one(){
//     	console.log("hello")
//     }
// 	two(){
//     	console.log("hello")
//     }
// }


function render(el){
  manipulateDom(el, view())
}

console.log(view())
