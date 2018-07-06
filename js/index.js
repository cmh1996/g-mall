window.onload = function(){
	var controller = {
		//初始化
		init:function(){
			this.pages = document.getElementsByClassName('page');
			this.indexPage = document.getElementById('indexPage');
			this.typePage = document.getElementById('typePage');
			this.goodsPage = document.getElementById('goodsPage');
			this.cartPage = document.getElementById('cartPage');
			this.detailPage = document.getElementById('detailPage');
			this.bottomNav = document.getElementsByClassName('bottom-nav')[0];
			this.bottomNavItems = document.getElementsByClassName('bottom-nav-item');
			this.backBtn = document.getElementsByClassName('backBtn')[0];
			this.detailContent = document.getElementsByClassName('detail-content')[0];
			this.typeItem = document.getElementsByClassName('type-item');
			this.goodsList = document.getElementsByClassName('goods-item-list')[0];
			this.dot1 = document.getElementById('dot1');
			this.dot2 = document.getElementById('dot2');
			this.addBtn = document.getElementsByClassName('addBtn')[0];
			this.buyBtn = document.getElementsByClassName('buyBtn')[0];
			this.orderBtn = document.getElementsByClassName('order')[0];
			this.cartBtn = document.getElementsByClassName('cart')[0];
			this.cartGoodsList = document.getElementsByClassName('cart-goods-list')[0];
			this.selectAllBtn = document.getElementsByClassName('cart-select-all-btn');
			this.cartMoney = document.getElementsByClassName('cart-amount-money')[0];
			this.cartNumber = document.getElementsByClassName('cart-amount-bottom')[0];
			this.confirmBtn = document.getElementsByClassName('cart-confirm-btn')[0];
			this.hotGoods = data.hotGoods;
			this.shiftGoods = data.shiftGoods;
			this.shoesGoods = data.shoesGoods;
			this.footballGoods = data.footballGoods;
			this.partsGoods = data.partsGoods;
			this.allGoods = this.shiftGoods.concat(this.shoesGoods).concat(this.footballGoods).concat(this.partsGoods);
			//商品详情页当前商品
			this.curGoodsDetail = {
				img:'',
				name:'',
				price:'',
				count:'',
				desc:''
			};
			this.history = ['indexPage'];
			this.cartList = [];

			this.renderInitData();
			this.bindEvents();
		},

		//渲染初始数据
		renderInitData:function(){
			var hotBox = document.getElementsByClassName('hot-box')[0];
			var shiftBox = document.getElementsByClassName('shift-box')[0];
			var shoesBox = document.getElementsByClassName('shoes-box')[0];
			var footballBox = document.getElementsByClassName('football-box')[0];
			var partsBox = document.getElementsByClassName('parts-box')[0];
			var hotData = '',
				shiftData = '',
				shoesData = '',
				footballData = '',
				partsData = '',
				goodsData = '';

			this.hotGoods.forEach(function(item,index){
				hotData += '<li data-id='+item.id+' class="goodsItem"><img src="'+item.img+'"><p>'+item.name+'</p><p class="price">￥'+item.price+'.00</p></li>';
				goodsData += '<li data-id='+item.id+' class="goods-item"><img src="'+item.img+'"><div class="rightBox"><p class="name">'+item.name+'</p><p class="price">￥'+item.price+'.00</p><p class="comment">暂无评价 100%好评</p></div></li>';
			})
			this.shiftGoods.forEach(function(item,index){
				shiftData += '<li data-id='+item.id+' class="goodsItem"><img src="'+item.img+'"><p>'+item.name+'</p><p class="price">￥'+item.price+'.00</p></li>';
			})
			this.shoesGoods.forEach(function(item,index){
				shoesData += '<li data-id='+item.id+' class="goodsItem"><img src="'+item.img+'"><p>'+item.name+'</p><p class="price">￥'+item.price+'.00</p></li>';
			})
			this.footballGoods.forEach(function(item,index){
				footballData += '<li data-id='+item.id+' class="goodsItem"><img src="'+item.img+'"><p>'+item.name+'</p><p class="price">￥'+item.price+'.00</p></li>';
			})
			this.partsGoods.forEach(function(item,index){
				partsData += '<li data-id='+item.id+' class="goodsItem"><img src="'+item.img+'"><p>'+item.name+'</p><p class="price">￥'+item.price+'.00</p></li>';
			})
			hotBox.innerHTML = hotData;
			shiftBox.innerHTML = shiftData;
			shoesBox.innerHTML = shoesData;
			footballBox.innerHTML = footballData;
			partsBox.innerHTML = partsData;
			this.goodsList.innerHTML = goodsData;
		},

		//绑定事件
		bindEvents:function(){
			var that = this;
			//底部导航切换页面
			this.bottomNav.addEventListener('click',function(e){
				var page = e.target.getAttribute('data-page') || e.target.parentNode.getAttribute('data-page');
				that.changePage(page);
			},false);

			//返回按钮绑定事件
			this.backBtn.addEventListener('click',function(){
				that.changePage(that.history[that.history.length-2]);
			},false);

			//商品页类别按钮切换
			
			for(var i=0;i<this.typeItem.length;i++){
				this.typeItem[i].addEventListener('click',function(e){
					var type = e.currentTarget.getAttribute('data-type')+'Goods';
					var goodsData = '';
					that[type].forEach(function(item,index){
						goodsData += '<li data-id='+item.id+' class="goods-item"><img src="'+item.img+'"><div class="rightBox"><p class="name">'+item.name+'</p><p class="price">￥'+item.price+'.00</p><p class="comment">暂无评价 100%好评</p></div></li>';
					})
					that.goodsList.innerHTML = goodsData;

					//把当前商品设置为选中商品，然后跳转到详情页
					var goodsItems = document.getElementsByClassName('goods-item');
					for(var i=0;i<goodsItems.length;i++){
						that.setCurDetail(goodsItems[i]);
					};

					for(var i=0;i<that.typeItem.length;i++){
						if(that.typeItem[i]===e.currentTarget){
							addClass(that.typeItem[i],'selected');
						}else{
							removeClass(that.typeItem[i],'selected');
						}
					}
				},false);
			}

			//跳转到购物车
			this.orderBtn.addEventListener('click',function(){
				that.changePage('cartPage');
			})
			this.cartBtn.addEventListener('click',function(){
				that.changePage('cartPage');
			})

			//加入购物车
			this.addBtn.addEventListener('click',function(){
				var curGoods = JSON.parse(JSON.stringify(that.curGoodsDetail));
				curGoods.amount = 1;
				curGoods.selected = 1;
				that.cartList.push(curGoods);
				that.dot1.innerHTML = that.dot2.innerHTML = that.cartList.length;
				that.renderCart();
			},false);
			//立即购买
			this.buyBtn.addEventListener('click',function(){
				var curGoods = JSON.parse(JSON.stringify(that.curGoodsDetail));
				curGoods.amount = 1;
				curGoods.selected = 1;
				that.cartList.push(curGoods);
				that.dot1.innerHTML = that.dot2.innerHTML = that.cartList.length;
				that.changePage('cartPage');
				that.renderCart();
			},false);

			//全选点击
			for(var i=0;i<this.selectAllBtn.length;i++){
				that.selectAllBtn[i].addEventListener('click',function(e){
					if(e.currentTarget.firstElementChild.style.display==='none'){
						that.cartList.forEach(function(item,index){
							item.selected = 1;
						})
					}else{
						that.cartList.forEach(function(item,index){
							item.selected = 0;
						})
					}
					that.renderCart();
				},false);
			}

			//结账按钮
			this.confirmBtn.addEventListener('click',function(){
				that.cartList = that.cartList.filter(function(item){
					return item.selected===0;
				});
				that.dot1.innerHTML = that.dot2.innerHTML = that.cartList.length;
				that.renderCart();
				alert('结算成功！请耐心等待包裹派送~');
			},false);

			//把当前商品设置为选中商品，然后跳转到详情页
			var goodsItems = document.getElementsByClassName('goods-item');
			for(var i=0;i<goodsItems.length;i++){
				that.setCurDetail(goodsItems[i]);
			};
			var goods = document.getElementsByClassName('goodsItem');
			for(var i=0;i<goods.length;i++){
				that.setCurDetail(goods[i]);
			};
		},

		//跳转到详情页
		setCurDetail:function(elem){
			var that = this;
			var detail = '';
			elem.addEventListener('click',function(e){
				var curId = Number(e.currentTarget.getAttribute('data-id'));
				that.allGoods.forEach(function(item,index){
					if(item.id===curId){
						that.curGoodsDetail = item;
					}
				});
				var cur = that.curGoodsDetail;
				detail = '<img class="detail-img" src="'+cur.img+'">'+
				'<div class="detail-info">'+
					'<p class="detail-name">'+cur.name+'</p>'+
					'<div class="detail-price">￥'+cur.price+'.00<span>包邮</span></div>'+
					'<p class="detail-tips1">'+cur.desc+'</p>'+
					'<p class="detail-tips2">'+
						'顺丰包邮（新疆西藏EMS）16:30之前订单当日发货，16:30之后订单次日发货'+
					'</p>'+
					'<ul class="detail-tags">'+
						'<li><i class="iconfont icon-zhengque"></i>正品保证</li>'+
						'<li><i class="iconfont icon-zhengque"></i>快递包邮</li>'+
						'<li><i class="iconfont icon-zhengque"></i>无忧售后</li>'+
						'<li><i class="iconfont icon-zhengque"></i>运费险</li>'+
					'</ul>'+
				'</div>';

				that.detailContent.innerHTML = detail;
				that.changePage('detailPage',true);
			},false);
		},

		//切换页面
		changePage:function(page,hideNav){
			hideNav?this.bottomNav.style.display = 'none':this.bottomNav.style.display = 'flex';

			window.scrollTo(0,0);
			for(var i=0;i<this.bottomNavItems.length;i++){
				if(this.bottomNavItems[i].getAttribute('data-page')===page){
					addClass(this.bottomNavItems[i],'selected');
				}else{
					removeClass(this.bottomNavItems[i],'selected');
				}
			}

			for(var j=0;j<this.pages.length;j++){
				this.pages[j].style.display = 'none';
			}
			this[page].style.display = 'block';

			this.history.push(page);
		},

		//渲染购物车页面
		renderCart:function(){
			var that = this;
			//渲染列表
			var cartData = '';
			var isSelectAll = true;
			var money = 0;
			var num = 0;
			for(var i=0;i<that.cartList.length;i++){
				var it = that.cartList[i];
				if(it.selected==0){
					isSelectAll = false;
				}else{
					money+=(it.amount*it.price);
					num+=it.amount;
				}
				var icon = it.selected===1?'<i class="iconfont icon-zhengque"></i>':'<i class="iconfont icon-zhengque" style="display: none;"></i>';
				cartData += 
				'<li class="cart-list-item">'+
					'<div class="cart-select-one-btn" data-index="'+i+'">'+
			        	icon+
			        '</div>'+
			        '<img src="'+it.img+'">'+
			        '<div class="cart-list-item-info">'+
			        	'<p class="cart-list-item-name">'+it.name+'</p>'+
			        	'<div class="cart-list-item-bottom">'+
			        		'<span class="cart-list-item-price">￥'+it.amount*it.price+'</span>'+
			        		'<div class="cart-list-item-number">'+
			        			'<span class="cart-list-item-number-minus" data-index="'+i+'">-</span>'+
			        			'<input data-index="'+i+'" class="cart-list-item-number-input" type="number" value="'+it.amount+'"/>'+
			        			'<span class="cart-list-item-number-plus" data-index="'+i+'">+</span>'+
			        		'</div>'+
			        		'<span data-index="'+i+'" class="cart-list-item-delete">删除</span>'+
			        	'</div>'+
			        '</div>'+
				'</li>';
			}
			this.cartGoodsList.innerHTML = cartData;

			//重新绑定单选按钮事件
			var btns = document.getElementsByClassName('cart-select-one-btn');
			for(var i=0;i<btns.length;i++){
				btns[i].addEventListener('click',function(e){
					var isSelected = that.cartList[Number(e.currentTarget.getAttribute('data-index'))].selected;
					if(isSelected===1){
						that.cartList[Number(e.currentTarget.getAttribute('data-index'))].selected = 0;
					}else{
						that.cartList[Number(e.currentTarget.getAttribute('data-index'))].selected = 1;
					}
					that.renderCart();
				},false);
			}

			//绑定数目增减事件
			var minus = document.getElementsByClassName('cart-list-item-number-minus');
			var plus = document.getElementsByClassName('cart-list-item-number-plus');
			for(var i=0;i<minus.length;i++){
				minus[i].addEventListener('click',function(e){
					var index = Number(e.currentTarget.getAttribute('data-index'));
					that.cartList[index].amount = Math.max(1,that.cartList[index].amount-1);
					that.renderCart();
				},false);
				plus[i].addEventListener('click',function(e){
					var index = Number(e.currentTarget.getAttribute('data-index'));
					that.cartList[index].amount = that.cartList[index].amount+1;
					that.renderCart();
				},false);
			}

			//input数目onchange事件
			var inputs = document.getElementsByClassName('cart-list-item-number-input');
			for(var i=0;i<inputs.length;i++){
				inputs[i].addEventListener('change',function(e){
					var index = parseInt(e.currentTarget.getAttribute('data-index'));
					var amount = parseInt(e.currentTarget.value);
					if(amount>0){
						that.cartList[index].amount = amount;
					}
					that.renderCart();
				},false);
			}

			//删除事件
			var dels = document.getElementsByClassName('cart-list-item-delete');
			for(var i=0;i<dels.length;i++){
				dels[i].addEventListener('click',function(e){
					var index = parseInt(e.currentTarget.getAttribute('data-index'));
					that.cartList.splice(index,1);
					that.dot1.innerHTML = that.dot2.innerHTML = that.cartList.length;
					that.renderCart();
				},false);
			}

			//渲染全选选中状态
			if(isSelectAll){
				for(var i=0;i<this.selectAllBtn.length;i++){
					this.selectAllBtn[i].firstElementChild.style.display = 'block';
				}
			}else{
				for(var i=0;i<this.selectAllBtn.length;i++){
					this.selectAllBtn[i].firstElementChild.style.display = 'none';
				}
			}

			//渲染总价，总数
			this.cartMoney.innerHTML = '￥'+money;
			this.cartNumber.innerHTML = '共'+num+'件';
		},

	}

	controller.init();
}