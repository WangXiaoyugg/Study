// 单个的Node实例运行在单个线程中。// 要发挥多核系统的能力，// 需要启动一个Node进程集群来处理负载。// cluster模块就用于创建共享服务器端口的子进程。/*每个worker进程都是通过child_process.fork()方法产生的，所以它们可以通过IPC（进程间通信）与master进程通信。cluster.worker是worker进程对象，其中有 worker.id、worker.process等属性，还有worker.send()等方法 *//*在Node.js中，Process模块用于提供和程序主进程有关的功能，child_process用于创建子进程，cluster用于处理集群相关编程* */var cluster = require('cluster');var http = require('http');var numCPUs = require('os').cpus().length;// master是主进程// 此处判断是否为master进程// 是则根据CPU内核数创建worker进程if(cluster.isMaster){    // worker是运行节点    // 根据CPU数量启动worker    // Fork workers    for(var i=0;i< numCPUs;i++){        cluster.fork();    }    Object.keys(cluster.workers).forEach((id)=>{        console.log('I am running with ID : '+ cluster.workers[id].process.pid);    });    cluster.on('exit', (worker,code,signal)=>{        console.log('worker ' + worker.process.pid + 'died');    });}else {    // cluster.isWorker == true    // 运行到else中的代码    // 说明当前进程是worker进程    // 那么此worker进程就启动一个http服务    http.createServer((req,res)=>{        res.writeHead(200);        res.end('hello world\n');    }).listen(8000);}