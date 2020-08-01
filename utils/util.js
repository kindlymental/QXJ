const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

// 浮点型减
function sub(a, b) {
	var c, d, e;
	try {
		c = a.toString().split(".")[1].length;
	} catch (f) {
		c = 0;
	}
	try {
		d = b.toString().split(".")[1].length;
	} catch (f) {
		d = 0;
	}
	return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}

// 浮点型除法
function div(a, b) {
	var c, d, e = 0,
		f = 0
	try {
		e = a.toString().split('.')[1].length
	} catch (g) {
	}
	try {
		f = b.toString().split('.')[1].length
	} catch (g) {
	}
	return c = Number(a.toString().replace('.', '')), d = Number(b.toString().replace('.', '')), mul(c / d, Math.pow(10, f - e))
}

// 浮点型加法函数
function accAdd(arg1, arg2) {
	var r1, r2, m
	try {
		r1 = arg1.toString().split('.')[1].length
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = arg2.toString().split('.')[1].length
	} catch (e) {
		r2 = 0
	}
	m = Math.pow(10, Math.max(r1, r2))
	return ((arg1 * m + arg2 * m) / m).toFixed(2)
}

// 浮点型乘法
function mul(a, b) {
	var c = 0,
		d = a.toString(),
		e = b.toString()
	try {
		c += d.split('.')[1].length
	} catch (f) {
	}
	try {
		c += e.split('.')[1].length
	} catch (f) {
	}
	return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c)
}
// 排序 微信支付使用
function objKeySort(obj) {
	var newkey = Object.keys(obj).sort();
	var newObj = {};
	for (var i = 0; i < newkey.length; i++) {
		newObj[newkey[i]] = obj[newkey[i]];
	}
	return newObj;
}


module.exports = {
	formatTime: formatTime,
	objKeySort: objKeySort,
	sub,
	div,
	accAdd,
	mul
}
