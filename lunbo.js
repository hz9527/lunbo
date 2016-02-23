//创建json数组，假设为服务器端传来的数据
var imgs=[
	{"i":0,"src":"images/1.jpg","href":"http://www.baidu.com"},
	{"i":1,"src":"images/2.jpg","href":"http://www.360.com"},
	{"i":2,"src":"images/3.jpg","href":"http://www.qq.com"},
	{"i":3,"src":"images/4.jpg","href":"http://www.taobao.com"},
	{"i":4,"src":"images/5.jpg","href":"http://www.mi.com"},
	{"i":5,"src":"images/6.jpg","href":"http://www.meituan.com"}
]
//定义一个找元素的方法
window.$=HTMLElement.prototype.$=function(selector){
	var elems=(this==window?document:this).querySelectorAll(selector);
	if(elems.length==0){
		return null;
	}else if(elems.length==1){
		return elems[0];
	}else{
		return elems;
	}
}
var adv={
	LIWIDTH:670,
	ul:null,
	spandiv:null,
	duration:500,
	interval:20,
	wait:5000,
	timer:null,
	stepTimer:null,
	canAuto:true,
	init:function(){//初始化，第一步找到ul，设置ul宽，找到spandiv，生成span
		var self=this;
		self.ul=$("#content>ul");
		self.ul.style.width=self.LIWIDTH*(imgs.length-1)+'px';
		self.spandiv=$("#content>div#pointer");
		for(var c=0,idx=[];c<imgs.length;idx[c]=++c);
		self.spandiv.innerHTML='<span class="hover">'+idx.join("</span><span>")+'</span>';
		self.updataView();
		self.autoMove();
		self.ul.onmouseover=function(){
			self.canAuto=false;
		}
		self.ul.onmouseout=function(){
			self.canAuto=true;
		}
		self.spandiv.onmouseover=function(){//到任意一张
			var e=window.event||arguments[0];
			var target=e.srcElement||e.target;
			if(target.nodeName=="SPAN"&&(target.innerHTML-1)!=imgs[0].i){
				var n=target.innerHTML-1-imgs[0].i;
				self.move(n);
			}
		}
		$("#up").onclick=function(){
			self.move(-1);
		}
		$("#down").onclick=function(){
			self.move(1);
		}
		self.autoMove(1);
	},
	updataView:function(){//刷新界面，1.按照数组顺序将li插入到ul中，按照li的顺序生成span的class。
		var self=this;
		for(var c=0,li=[];c<imgs.length;c++){
			li[c]="<li><a href='"+imgs[c].href+"'><img src='"+imgs[c].src+"'/></a></li>";
		}
		self.ul.innerHTML=li.join("");
		$("#content>div#pointer>.hover").className="";
		$("#content>div#pointer>span")[imgs[0].i].className="hover";
	},
	move:function(n){
		var self=this;
		self.ul.style.left="0px";
		if(n>=0){
			var cut=imgs.splice(0,n);
			imgs=imgs.concat(cut);
		}else if(n<0){//注意，此时N为负数
			var cut=imgs.splice(n,-n);
			imgs=cut.concat(imgs);
		}
		self.updataView();
	},
	stepMove:function(){
		var self=this;
		clearTimeout(self.timer);
		timer=null;
		var step=self.LIWIDTH/(self.duration/self.interval);
		var left=parseFloat(getComputedStyle(self.ul).left);
		if(left>=-self.LIWIDTH){
			left-=step;
			self.ul.style.left=left+"px";
			self.stepTimer=setTimeout(function(){self.stepMove();},self.interval);
		}else{
			clearTimeout(self.stepTimer);
			self.stepTimer=null;
			self.move(1);
			console.log(3);
			self.autoMove();
		}
	},
	autoMove:function(n){
		var self=this;
		timer=setTimeout(function(){
			if(self.canAuto){
				self.stepMove();
				console.log(1);
			}else{
				self.autoMove();
				console.log(0);
			}
		},5000)
	}
}
window.onload=function(){
	adv.init();
}
