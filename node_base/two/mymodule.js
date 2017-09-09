//function hello(){
//   console.log('hello')
//}

//function world(){
//   console.log('world')
//}

//exports.hello = hello;
//exports.world = world;

function Hello(){
   this.hello = function(){
	console.log('Hello')
   };
   this.world = function(){
	console.log('World')
  };		
}

module.exports = Hello

