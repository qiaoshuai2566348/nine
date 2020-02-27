console.log("test start");
var seat = [];
var seat1 = {
	index:0,
	numOfMingGang:0,
	numOfAnGang:0,
	minggang:[0,0],
	angang:[0],
	score:0,
};
var seat2 = {
	index:1,
	numOfMingGang:0,
	numOfAnGang:0,
	minggang:[0,0],
	angang:[0],
	score:0,
};
var seat3 = {
	index:2,
	numOfMingGang:0,
	numOfAnGang:0,
	minggang:[0,0],
	angang:[0],
	score:0,
};
seat[0] = seat1;
seat[1] = seat2;
seat[2] = seat3;

for(var i = 0;i<seat.length;i++){
	seat[i].numOfMingGang += seat[i].minggang.length;
	seat[i].numOfMingGang += seat[i].angang.length *2;
	seat[i].score += seat[i].numOfMingGang * (seat.length - 1);
	seat[i].score += seat[i].numOfAnGang * (seat.length - 1) * 2;
	for(var k = 0;k<seat.length;k++){
		if(seat[i].index == seat[k].index)
			continue;
		// seat[i].numOfMingGang -= seat[k].minggang.length;
		// seat[i].numOfMingGang -= seat[k].angang.length *2;
		seat[k].score -= seat[i].numOfMingGang;
		seat[k].score -= seat[i].numOfAnGang * 2;

	}
}
console.log(6%9+1);
console.log(15%9+1);
console.log(24%9+1);



