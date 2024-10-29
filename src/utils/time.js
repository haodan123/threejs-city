export const getTimeDate = () => {
	let data = new Date();
	let year = data.getFullYear();
	let month = data.getMonth() + 1;
	let day = data.getUTCDate();
	let hours = data.getHours() < 10 ? "0" + data.getHours() : data.getHours(); //时
	let min = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes(); //分
	let second = data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds();
	let datepage = year + "-" + month + "-" + day + ' ' + hours + ":" + min + ":" + second

	// 获取星期几
	let weekDayNames = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
	let weekDay = weekDayNames[data.getDay()]

	return {
		datepage,
		second,//秒
		min,//分
		hours,//小时
		day,//天
		month,//月
		year,//年
		weekDay//星期几
	}
}

// 获取明天的日期
export const getTomorrowDate = () => {
	// 获取当前日期
	const today = new Date();

	// 创建一个新的 Date 对象并设置为今天的日期
	const tomorrow = new Date(today);

	// 将日期增加一天
	tomorrow.setDate(today.getDate() + 1);

	// 获取年、月、日并格式化
	const year = tomorrow.getFullYear();
	const month = (tomorrow.getMonth() + 1).toString().padStart(2, '0'); // 月份是从0开始的，所以需要加1
	const day = tomorrow.getDate().toString().padStart(2, '0');

	// 返回格式化后的日期
	return `${year}-${month}-${day}`;
}