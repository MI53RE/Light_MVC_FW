app.libs.Observable = (function(){
	function Observable(){
		
		this.observers = [];
	}
	Observable.prototype.attach = function(obs){
		this.observers.push(obs);
	};

	Observable.prototype.detach = function(obs){
		var idx = this.observers.indexOf(obs);

		if (idx !== -1){
			this.observers.splice(idx , 1);
		}
	};

	Observable.prototype.notify = function(event){
		this.observers.forEach(function(obs){
			obs.update.call(obs, event);
		});
	};
	return Observable;
}).call(this);