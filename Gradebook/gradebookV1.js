addEventListeners();

function addAssignment(){
	var newAssignment = document.getElementById("addAssignment").value;
	var points = parseInt(document.getElementById("points").value);
	if(newAssignment != "" && points > 0){
		var head = document.getElementById("head");
		var newCell = head.insertCell(head.cells.length - 1);
		newCell.innerHTML = newAssignment + "<br><span id=\"assignmentTotal\">" + points + "</span>";
		moveOver();
		updateTotal(points);
		document.getElementById("addAssignment").value = "";
		document.getElementById("points").value = "";
	}
}

function addEventListeners(){
var assignmentInput = document.getElementById("addAssignment");
var pointsInput = document.getElementById("points");
var fNameInput = document.getElementById("fName");
var lNameInput = document.getElementById("lName");
assignmentInput.addEventListener("keyup", function(event) {
	if(event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("assign-button").click();
	}
});
pointsInput.addEventListener("keyup", function(event) {
	if(event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("assign-button").click();
	}
});
fNameInput.addEventListener("keyup", function(event) {
	if(event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("stu-button").click();
	}
});
lNameInput.addEventListener("keyup", function(event) {
	if(event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("stu-button").click();
	}
});
}

function addStudent(){
	//create new row and label first cell with name
	var row = createStudent();
	//Fills in all asignments for new student with zeros
	console.log(row);
	if(row != -1){
		fillScores(row);
		document.getElementById("fName").value = "";
		document.getElementById("lName").value = "";
	}
	
}

function createStudent(){
	var table = document.getElementById("classTable");
	var fName = document.getElementById("fName").value;
	var lName = document.getElementById("lName").value;
	if(fName != "" && lName != ""){
		var name = lName + ", " + fName;
		//figure out where to put student alphabetically
		var studentNum = getPosition(name);
		var row = table.insertRow(studentNum);
		var nameCell = row.insertCell(0);
		nameCell.innerHTML = "<span id=\"student\">" + name + "</span>";
		return row;
	} else {
		alert("Enter both first and last name");
		return -1;
	}
}

function displayChart() {
	var breakdown = getClassNumbers();
	if(breakdown!=null){
		var chart = new CanvasJS.Chart("chartContainer", {
			animationEnabled: true,
			title: {
				text: "Class Average"
			},
			data: [{
				type: "pie",
				startAngle: 240,
				yValueFormatString: "##0.00\"%\"",
				indexLabel: "{label} {y}",
				dataPoints: [
					{y: breakdown.a, label: "90-100"},
					{y: breakdown.b, label: "80-90"},
					{y: breakdown.c, label: "70-80"},
					{y: breakdown.d, label: "60-70"},
					{y: breakdown.fail, label: "Below 60"}
				]
			}]
		});
		chart.render();
	}
}

function editScore(e){
	var name = event.path[2].cells[0].innerText;
	name = name;
	var score = parseInt(prompt("Edit Score for: " + name));
	if(isNaN(score)){
		console.log("error");
	} else {
		e.target.innerHTML = score;
	}
	
	//update total
	var total = 0;
	var length = (e.path[2].cells.length) - 1;
	for(var i = 1; i < length; i++){
		total += parseInt(e.path[2].cells[i].innerText);
	}

	e.path[2].cells[length].innerHTML = total;
}

function fillScores(row){
	var head = document.getElementById("head");
	var headLength = head.childElementCount;
	var newCell = row.insertCell(1);
	//First new cell will be for the total column
	newCell.innerHTML = "<span>0</span>";
	for(var i = 2; i < headLength; i++){
		var newCell = row.insertCell(1);
		newCell.innerHTML = "<span class=\"edit\" onclick=\"editScore(event)\">0</span>";
	}
}

function getAssignmentTotal(){
	var total = 0;
	var totals = document.querySelectorAll("#assignmentTotal");
	var totalsArr = Array.from(totals);
	for(var i = 0; i < totalsArr.length; i++){
		total += parseInt(totalsArr[i].innerText);
	}
	return total;
}

function getClassNumbers(){
	var table = document.getElementById("classTable");
	var numOfStudents = table.children[0].childElementCount;
	if(numOfStudents === 1){
		return null;
	} else {
		var a = 0, b = 0, c = 0, d = 0, fail = 0;
		for(var i = 1; i < numOfStudents; i++){
			var cellsLength = table.children[0].children[i].cells.length;
			var studentTotal =table.children[0].children[i].cells[cellsLength-1].innerText;
			var studentAvg = parseInt((studentTotal/getAssignmentTotal()) * 100);
			if(studentAvg >= 90){
				a++;
			} else if(studentAvg >= 80){
				b++;
			} else if(studentAvg >= 70){
				c++;
			} else if(studentAvg >= 60){
				d++;
			} else if(studentAvg < 60){
				fail++;
			}
		}
		a = (a / (numOfStudents - 1)) * 100;
		b = (b / (numOfStudents - 1)) * 100;
		c = (c / (numOfStudents - 1)) * 100;
		d = (d / (numOfStudents - 1)) * 100;
		fail = (fail / (numOfStudents - 1)) * 100;
		var breakdown = {
			a: a,
			b: b,
			c: c,
			d: d,
			fail: fail
		};
		return breakdown;
	}	
}

function getPosition(name){
	var students = document.querySelectorAll('#student');
	if(students.length == 0){
		return 1;
	}
	var studentArr = Array.from(students);
	var names = [];
	for(var i = 0; i < studentArr.length; i++){
		names[i] = studentArr[i].innerText.toLowerCase();
	}
	//Fix something here
	name = name.toLowerCase();
	names.unshift(name);
	names.sort();
	return (names.indexOf(name)) + 1;
}

function moveOver(){
	var table = document.getElementById("classTable");
	var length = table.rows.length;
	var head = document.getElementById("head");
	var headLength = (head.childElementCount) - 1;
	for(var i = 1; i < length; i++){
		//create new td at the end of each row
		var newCell = table.children[0].children[i].insertCell(headLength);
		//move data from second to last td to last td 
		var cell = table.children[0].children[i].cells[headLength - 1].innerText;
		table.children[0].children[i].cells[headLength].innerText = cell;
		//set second to last td innerHTML
		table.children[0].children[i].cells[headLength - 1].innerHTML = "<span class=\"edit\" onclick=\"editScore(event)\">0</span>";}	
}

function updateTotal(points){
	total = parseInt(document.getElementById("grandTotal").innerHTML);
	total += points;
	document.getElementById("grandTotal").innerHTML = total;
}




