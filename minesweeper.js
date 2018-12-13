function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function checkWin() {
	var b_width = Math.round(document.getElementById("b_width").value);
	var b_height = Math.round(document.getElementById("b_height").value);
	var num_bombs = Math.round(document.getElementById("num_bombs").value);
	var flagged_bombs = 0;

	for (var i = 0; i < b_width*b_height; i++) {
		var boardbutton = document.getElementById(i);
		if (boardbutton.classList.contains("bomb") && boardbutton.classList.contains("flagged")) {
			flagged_bombs++;
		}
	}
	if (flagged_bombs == num_bombs) {
		return true;
	} else {
		return false;
	}
}

function winGame(time) {
	var end_time = document.createTextNode(document.getElementById("timer").innerHTML)
	var end_th = document.createElement("th");
	end_th.append(end_time);
	end_th.id = "endtime";
	end_th.setAttribute("colspan", "2");
	$("#timer").replaceWith(end_th); 

	$("#gameboard").after("<h3 id =\"winGame\">You are da bomb! (You win)</h3>");
	addHighScore(Number(time));

	var b_width = Math.round(document.getElementById("b_width").value);
	var b_height = Math.round(document.getElementById("b_height").value);
	for (var i = 0; i < b_width*b_height; i++) {
		var boardbutton = document.getElementById(i);
		if (boardbutton.classList.contains("bomb")) {
			boardbutton.children[0].remove();
			boardbutton.children[0].style.visibility = "visible";
			boardbutton.classList.add("revealed");
		}
		$(boardbutton).replaceWith($(boardbutton).clone());  // <--------Remove all click handlers
	}

}

function loseGame(cell) {
	//$("#1").replaceWith($("#1").clone());
	cell.children[0].style.visibility = "visible";
	cell.classList.add("revealed");

	var end_time = document.createTextNode(document.getElementById("timer").innerHTML)
	var end_th = document.createElement("th");
	end_th.append(end_time);
	end_th.id = "endtime";
	end_th.setAttribute("colspan", "2");
	$("#timer").replaceWith(end_th); 

	var b_width = Math.round(document.getElementById("b_width").value);
	var b_height = Math.round(document.getElementById("b_height").value);
	for (var i = 0; i < b_width*b_height; i++) {
		var boardbutton = document.getElementById(i);
		if (boardbutton.classList.contains("bomb")) {
			boardbutton.children[0].remove();
			boardbutton.children[0].style.visibility = "visible";
			boardbutton.classList.add("revealed");
		}
		$(boardbutton).replaceWith($(boardbutton).clone());  // <--------Remove all click handlers
	}

	$("#gameboard").after("<h3 id=\"loseGame\">KMP is da bomb! (You lose)</h3>");
}

function addHighScore(time) {
	var best_times = [];	
	if (document.getElementsByClassName("time")[0].innerHTML != "--") best_times.push(Number((document.getElementsByClassName("time")[0].innerHTML).substring(0, document.getElementsByClassName("time")[0].classList[2])));
	if (document.getElementsByClassName("time")[1].innerHTML != "--") best_times.push(Number((document.getElementsByClassName("time")[1].innerHTML).substring(0, document.getElementsByClassName("time")[1].classList[2])));
	if (document.getElementsByClassName("time")[2].innerHTML != "--") best_times.push(Number((document.getElementsByClassName("time")[2].innerHTML).substring(0, document.getElementsByClassName("time")[2].classList[2])));
	if (document.getElementsByClassName("time")[3].innerHTML != "--") best_times.push(Number((document.getElementsByClassName("time")[3].innerHTML).substring(0, document.getElementsByClassName("time")[3].classList[2])));
	if (document.getElementsByClassName("time")[4].innerHTML != "--") best_times.push(Number((document.getElementsByClassName("time")[4].innerHTML).substring(0, document.getElementsByClassName("time")[4].classList[2])));
	best_times.push(Number(time));

	best_times.sort(function(a, b) {return a-b});

	for (var i = 0; i < best_times.length; i++) {
		if (i == 5) continue;
		$(".time")[i].innerHTML = best_times[i] + " seconds";
		$(".time")[i].classList.add(time.toString().length);
	}
}

function generate_board() {

//Create physical board ****************************************************************************************************************
	if (!document.contains(document.getElementById("gameboard"))) {
		var div = document.createElement("div");
		div.id = "gameboard";
		//document.getElementsByTagName("body")[0].appendChild(div);
		$("#dimensions").after(div);
		$("#gameboard").before("<br>");
	} else {
		document.getElementsByTagName("div")[0].remove();
		document.getElementsByTagName("br")[4].remove();
		if (document.getElementsByTagName("h3")[0] != null) {
			document.getElementsByTagName("h3")[0].remove();
		}
		generate_board();
	}

	//Get board information
	var b_width = Math.round(document.getElementById("b_width").value);
	var b_height = Math.round(document.getElementById("b_height").value);
	var num_bombs = Math.round(document.getElementById("num_bombs").value);

	//Check board dimensions to ensure that they are not too big or small.
	if (b_width < 8 || b_width > 40) {
		alert("Board width must be between 8 and 40.");
		return;
	}
	if (b_height < 8 || b_height > 30) {
		alert("Board height must be between 8 and 30.");
		return;
	}
	if (num_bombs < 1 || num_bombs >= b_height*b_width) {
		alert("Number of bombs must be between 1 and w*h-1");
		return;
	}

	//Create gameboard HTML with the given board dimensions
	var tableHTML = "";

	for (var i = 1; i <= b_width; i++) {
			tableHTML += "<td><button class=\"boardbutton\" style=\"width:20px; height:20px; border:outset; border-width:3px; border-color: silver;\";></button></td>";
	}
	table_row = "<tr>" + tableHTML + "</tr>";
	for (var i = 1; i <= b_height - 1; i++) {
		tableHTML += table_row;
	}

	//Use gameboard HTML to make board
	var gameboard = document.getElementById("gameboard");
	gameboard.style.backgroundColor = "#ef4452 ";
	gameboard.style.width = "" + (b_width * 20 + 4) + "px";

	gameboard.innerHTML = "<table><tr><th colspan=" + b_width + " + height=\"20px\" style=\"border: outset;\">Minesweeper</th></tr><tr><th id=\"smiley\" colspan=" + (b_width-4) + " style=\"border:outset; height:20px\">:)</th></tr>" + tableHTML + "</table>"/* + "<br><button onclick=\"reset_board\">Reset Board</button>"*/;

	var timer = document.createElement("th");
	timer.id="timer";
	var seconds = 0;
	timer.style.border = "outset";
	timer.setAttribute("colspan", "2");
	timer.innerHTML = 0;
	document.getElementsByTagName("tr")[1].append(timer);

	bomb_counter = document.createElement("th");
	bomb_counter.style.border = "outset";
	bomb_counter.setAttribute("colspan", "2");
	bomb_counter.innerHTML = num_bombs;
	document.getElementsByTagName("tr")[1].prepend(bomb_counter);

	//Pick and set bomb tiles **********************************************************************************************************
	for (var i = 0; i < b_height*b_width; i++) {
		document.getElementsByTagName("button")[i].id = i;
	}
	var bomb_tiles = new Set();
	while (bomb_tiles.size < num_bombs) {	
		for (var i = 1; i <= num_bombs; i++) {
			if (bomb_tiles.size < num_bombs) {
				bomb_tiles.add(getRandomInt(b_width*b_height));
			}
		}
	}
	var bomb_array = Array.from(bomb_tiles);
	for (var i = 0; i < bomb_array.length;i++) {
		var temp = bomb_array[i];
		document.getElementById(temp).classList.add("bomb");
		//document.getElementById(temp).style.background = "blue";  // <----- Reveals all bombs when the board loads
	}

	//Add adjacent mine numbers ********************************************************************************************************
	for (var i = 0; i < b_width*b_height; i++) {
			var cell = document.getElementById(i);
			var adj_bomb_count = 0;
			//Check left 
			if (i%b_width != 0) {
				if (document.getElementById(i-1).classList.contains("bomb")) {
					adj_bomb_count++;
				} 
				//Check top-left
				if (i >= b_width && document.getElementById(i-(b_width+1)).classList.contains("bomb")) {
					adj_bomb_count++;
				}
				//Check bottom-left
				if (i < ((b_width*b_height)-b_width) && document.getElementById(i+(b_width-1)).classList.contains("bomb")) {
					adj_bomb_count++;
				}
			}
			//Check right
			if (i == 0 || (i+1)%(b_width) != 0) {
				if (document.getElementById(i+1).classList.contains("bomb")) {
					adj_bomb_count++;
				}
				//Check top-right
				if (i >= b_width && document.getElementById(i-(b_width-1)).classList.contains("bomb")) {
					adj_bomb_count++;
				}
				//Check bottom-right
				if (i < ((b_width*b_height)-b_width) && document.getElementById(i+(b_width+1)).classList.contains("bomb")) {
					adj_bomb_count++;
				}
			}
			//Check top
			if (i > b_width - 1) {
				if (document.getElementById(i-b_width).classList.contains("bomb")) {
					adj_bomb_count++;
				}
			}

			//Check bottom
			if (i < ((b_width*b_height) - b_width)) {
				if (document.getElementById(i+(b_width)).classList.contains("bomb")) {
					adj_bomb_count++;
				}
			}

		//Add adj_bomb_count to the board tiles and hide it
		var number = document.createElement("p");
		number.classList.add("tile");
		number.style.visibility = "hidden";
		var text = document.createTextNode(adj_bomb_count);
		number.appendChild(text);
		//if (!document.getElementsByTagName("button")[i].classList.contains("bomb"))
		document.getElementsByTagName("button")[i].appendChild(number);
		document.getElementById(i).classList.add(adj_bomb_count);

		if (document.getElementById(i).classList.contains("bomb")) {
			var img = document.createElement("img");
			img.classList.add("kmp_bomb");
			img.setAttribute("src", "kmp_face.jpg");
			img.setAttribute("width", "14");
			img.setAttribute("height", "15");
			img.style.visibility = "hidden";
			document.getElementById(i).appendChild(img);
		} 
	}

	var firstClick = false;
	var revealed_tiles = 0;
	//Add event click listeners to every board button (also checks if shift key is held down)
	for (var i = 0; i < b_width*b_height; i++) {
		var boardbutton = document.getElementById(i);

		if (boardbutton.classList.contains("revealed")) {
			continue;
		}
		//On mouseup, check if shiftkey is held and add/remove a flag if it is. Otherwise, display the tile's adj_bomb_count.
		boardbutton.addEventListener("mouseup", function handleMouseUp(e) {
			if (!firstClick) {
				firstClick = true;

				setInterval(function() {
				timer.innerHTML = seconds++;
				}, 1000);
			}

			if (this.classList.contains("revealed") && this.classList.contains("bomb")) {
				return;
			} else if (this.classList.contains("revealed")) {
				var oo = document.createElement("th");
				oo.id = "smiley";
				oo.setAttribute("colspan", "4");
				oo.style.border = "outset";
				oo.style.height = "20px";
				var O = document.createTextNode(":)");
				oo.append(O);

				document.getElementById("oo").replaceWith(oo);
				reveal_adjacent(this, b_width, b_height);
			} else {
				if (e.shiftKey) {
					var oo = document.createElement("th");
					oo.id = "smiley";
					oo.setAttribute("colspan", "4");
					oo.style.border = "outset";
					oo.style.height = "20px";
					var O = document.createTextNode(":)");
					oo.append(O);

					document.getElementById("oo").replaceWith(oo);

					if (this.classList.contains("flagged")) {
						this.classList.remove("flagged");
						this.children[0].style.visibility = "hidden";
						this.children[0].style.color = "black";
						this.children[0].innerHTML = this.classList[1];
						bomb_counter.innerHTML++;
						if (bomb_counter.innerHTML == 0) {
							bomb_counter.style.color = "blue";
						} else {
							bomb_counter.style.color = "black";
						}
					} else {
						this.children[0].innerHTML = "!";
						this.children[0].style.visibility = "visible";
						this.children[0].style.color = "red";
						this.classList.add("flagged"); 
						bomb_counter.innerHTML--;
						if (bomb_counter.innerHTML == 0) {
							bomb_counter.style.color = "blue";
						} else {
							bomb_counter.style.color = "black";
						}
						if (Number(revealed_tiles) == b_width * b_height - num_bombs) {
							if (checkWin()) {
								winGame(timer.innerHTML);
							}
						}
					}
				} else {

					if (this.classList.contains("bomb")){
						var oo = document.createElement("th");
						oo.id = "frowny";
						oo.setAttribute("colspan", "4");
						oo.style.border = "outset";
						oo.style.height = "20px";
						var O = document.createTextNode(":(");
						oo.append(O);

						document.getElementById("oo").replaceWith(oo);
					} else {
						var oo = document.createElement("th");
						oo.id = "smiley";
						oo.setAttribute("colspan", "4");
						oo.style.border = "outset";
						oo.style.height = "20px";
						var O = document.createTextNode(":)");
						oo.append(O);

						document.getElementById("oo").replaceWith(oo);
					}

					if (this.children[0].innerHTML == "!") {
						return;
					} else {
						this.children[0].style.visibility = "visible";
						this.classList.add("revealed");

						if (this.classList.contains("bomb")) {
							loseGame(this);
							return;
						}

						revealed_tiles++;

						if (this.classList.contains("0")) {
							this.children[0].style.color = "lightgray";
							this.style.border = "none";
							revealed_tiles += reveal(this, b_width, b_height);
						}

						if (Number(revealed_tiles) == b_width * b_height - num_bombs) {
							if (checkWin()) {
								winGame(timer.innerHTML);
							}
						}
					}
				}
			}
		}, true);

		boardbutton.addEventListener("mousedown", function(e) {
			var oo = document.createElement("th");
			oo.id = "oo";
			oo.setAttribute("colspan", "4");
			oo.style.border = "outset";
			oo.style.height = "20px";
			var O = document.createTextNode(":O");
			oo.append(O);

			document.getElementById("smiley").replaceWith(oo);
			}, true);
	}	
}



function reveal(cell, b_width, b_height) {		// Recursively reveal tiles when a 0 tile is clicked
	var revealed_tiles = 0;	

	if (cell.classList.contains("flagged")){
		return;
	}

	if (cell.classList.contains("0")) {
		if (!cell.classList.contains("revealed")) {
			cell.children[0].style.visibility = "visible";
			cell.classList.add("revealed");
			cell.children[0].style.color = "lightgray";
			cell.style.border = "none";
			revealed_tiles++;
		}

		var i = cell.id;

		if (i%b_width != 0) {
			var left = document.getElementById(Number(i)-1);
			if (!left.classList.contains("revealed"))
				revealed_tiles += reveal(left, b_width, b_height);
			if (i >= b_width) {	
				var top_left = document.getElementById(Number(i)-(b_width+1));
				if (!top_left.classList.contains("revealed"))
					revealed_tiles += reveal(top_left, b_width, b_height);
			}
			if (i < ((b_width*b_height)-b_width)) {
				var bottom_left = document.getElementById(Number(i)+(b_width-1));
				if (!bottom_left.classList.contains("revealed"))
					revealed_tiles += reveal(bottom_left, b_width, b_height);
			}
		}

		if (i == 0 || (Number(i)+1) % (b_width) !== 0) {
			var right = document.getElementById(Number(i)+1);
			if (!right.classList.contains("revealed"))
				revealed_tiles += reveal(right, b_width, b_height);
			if (i >= b_width) {
				var top_right = document.getElementById(Number(i)-(b_width-1));
				if (!top_right.classList.contains("revealed"))
					revealed_tiles += reveal(top_right, b_width, b_height);
			}
			if (i < ((b_width*b_height)-b_width)) {
				var bottom_right = document.getElementById(Number(i)+(b_width+1));
				if (!bottom_right.classList.contains("revealed"))
					revealed_tiles += reveal(bottom_right, b_width, b_height);
			}			
		}
		
		if (i > b_width - 1) {
			var top = document.getElementById(Number(i)-b_width);
			if (!top.classList.contains("revealed"))
				revealed_tiles += reveal(top, b_width, b_height);
		}

		if (i < ((b_width*b_height) - b_width)) {
			var bottom = document.getElementById(Number(i)+(b_width));
			if (!bottom.classList.contains("revealed"))
				revealed_tiles += reveal(bottom, b_width, b_height);
		}
	} else {
		if (!cell.classList.contains("revealed")) {
			cell.children[0].style.visibility = "visible";
			cell.classList.add("revealed");
			revealed_tiles++;
		}
	}
	return revealed_tiles;
}

function check_adjacent(cell, b_width, b_height) {
	var number_adjacent_flags = 0;

	var i = cell.id;

	if (i%b_width != 0) {
		var left = document.getElementById(Number(i)-1);
		if (left.classList.contains("flagged")) {
			number_adjacent_flags++;
		}
		if (i >= b_width) {	
			var top_left = document.getElementById(Number(i)-(b_width+1));
			if (top_left.classList.contains("flagged")) {
				number_adjacent_flags++;
			}
		}
		if (i < ((b_width*b_height)-b_width)) {
			var bottom_left = document.getElementById(Number(i)+(b_width-1));
			if (bottom_left.classList.contains("flagged")) {
				number_adjacent_flags++;
			}
		}
	}

	if (i == 0 || (Number(i)+1) % (b_width) !== 0) {
		var right = document.getElementById(Number(i)+1);
		if (right.classList.contains("flagged")) {
			number_adjacent_flags++;
		}
		if (i >= b_width) {
			var top_right = document.getElementById(Number(i)-(b_width-1));
			if (top_right.classList.contains("flagged")) {
				number_adjacent_flags++;	
			}
		}
		if (i < ((b_width*b_height)-b_width)) {
			var bottom_right = document.getElementById(Number(i)+(b_width+1));
			if (bottom_right.classList.contains("flagged")){
				number_adjacent_flags++;
			}
		}			
	}
	
	if (i > b_width - 1) {
		var top = document.getElementById(Number(i)-b_width);
		if (top.classList.contains("flagged")) {
			number_adjacent_flags++;
		}
	}

	if (i < ((b_width*b_height) - b_width)) {
		var bottom = document.getElementById(Number(i)+(b_width));
		if (bottom.classList.contains("flagged")) {
			number_adjacent_flags++;
		}
	}

	return number_adjacent_flags;
}

function reveal_adjacent(cell, b_width, b_height) {
	if (cell.classList.contains("0")) {
		return;
	} else {
		var i = Number(cell.id);

		var adjacent = (check_adjacent(cell, b_width, b_height) == Number(cell.classList[1]));

		if (i%b_width != 0) {
			var left = document.getElementById(Number(i)-1);
			if (!left.classList.contains("revealed") && adjacent) {
				if (left.classList.contains("bomb") && !left.classList.contains("flagged") && !left.classList.contains("revealed")) {
					//left.children[0].remove();
					left.children[0].style.visibility = "visible";
					loseGame(left);	
				} else {
					if (left.classList.contains("0") && !left.classList.contains("flagged")) {
						left.children[0].style.color = "lightgray";
						left.style.border = "none";
					}
					left.children[0].style.visibility = "visible";
					left.classList.add("revealed");
				}
			}
			if (i >= b_width) {	
				var top_left = document.getElementById(Number(i)-(b_width+1));
				if (!top_left.classList.contains("revealed") && adjacent) {
					if (top_left.classList.contains("bomb") && !top_left.classList.contains("flagged") && !top_left.classList.contains("revealed")) {
						//top_left.children[0].remove();
						top_left.children[0].style.visibility = "visible";
						loseGame(top_left);		
					} else {
						if (top_left.classList.contains("0") && !top_left.classList.contains("flagged")) {
							top_left.children[0].style.color = "lightgray";
							top_left.style.border = "none";
						}
						top_left.children[0].style.visibility = "visible";
						top_left.classList.add("revealed");
					}
				}
				if (i < ((b_width*b_height)-b_width)) {
					var bottom_left = document.getElementById(Number(i)+(b_width-1));
					if (!bottom_left.classList.contains("revealed") && adjacent) {
						if (bottom_left.classList.contains("bomb") && !bottom_left.classList.contains("flagged") && !bottom_left.classList.contains("revealed")) {
							//bottom_left.children[0].remove();
							bottom_left.children[0].style.visibility = "visible";
							loseGame(bottom_left);
						} else {
							if (bottom_left.classList.contains("0") && !bottom_left.classList.contains("flagged")) {
								bottom_left.children[0].style.color = "lightgray";
								bottom_left.style.border = "none";
							}
							bottom_left.children[0].style.visibility = "visible";
							bottom_left.classList.add("revealed");
						}
					}
				}
			}
		}

		if (i == 0 || (Number(i)+1) % (b_width) !== 0) {
			var right = document.getElementById(Number(i)+1);
			if (!right.classList.contains("revealed") && adjacent) {
				if (right.classList.contains("bomb") && !right.classList.contains("flagged") && !right.classList.contains("revealed")) {
					//right.children[0].remove();
					right.children[0].style.visibility = "visible";
					loseGame(right);	
				} else {
					if (right.classList.contains("0") && !right.classList.contains("flagged")) {
						right.children[0].style.color = "lightgray";
						right.style.border = "none";
					}
					right.children[0].style.visibility = "visible";
					right.classList.add("revealed");
				}
			}
			if (i >= b_width) {
				var top_right = document.getElementById(Number(i)-(b_width-1));
				if (!top_right.classList.contains("revealed") && adjacent) {
					if (top_right.classList.contains("bomb") && !top_right.classList.contains("flagged") && !top_right.classList.contains("revealed")) {
						//top_right.children[0].remove();
						top_right.children[0].style.visibility = "visible";
						loseGame(top_right);
					} else {
						if (top_right.classList.contains("0") && !top_right.classList.contains("flagged")) {
							top_right.children[0].style.color = "lightgray";
							top_right.style.border = "none";
						}
						top_right.children[0].style.visibility = "visible";
						top_right.classList.add("revealed");
						
					}
				}
			}
			if (i < ((b_width*b_height)-b_width)) {
				var bottom_right = document.getElementById(Number(i)+(b_width+1));
				if (!bottom_right.classList.contains("revealed") && adjacent) {
					if (bottom_right.classList.contains("bomb") && !bottom.classList.contains("flagged") && !bottom_right.classList.contains("revealed")) {
						//bottom_right.children[0].remove();
						bottom_right.children[0].style.visibility = "visible";
						loseGame(bottom_right);				
					} else {
						if (bottom_right.classList.contains("0") && !bottom_right.classList.contains("flagged")) {
							bottom_right.children[0].style.color = "lightgray";
							bottom_right.style.border = "none";
						}
						bottom_right.children[0].style.visibility = "visible";
						bottom_right.classList.add("revealed");
					}
				}
			}		
		}
		
		if (i > b_width - 1) {
			var top = document.getElementById(Number(i)-b_width);
			if (!top.classList.contains("revealed") && adjacent) {
				if (top.classList.contains("bomb") && !top.classList.contains("flagged") && !top.classList.contains("revealed")) {
					//top.children[0].remove();
					top.children[0].style.visibility = "visible";
					loseGame(top);
				} else {
					if (top.classList.contains("0") && !top.classList.contains("flagged")) {
						top.children[0].style.color = "lightgray";
						top.style.border = "none";
					}
					top.children[0].style.visibility = "visible";
					top.classList.add("revealed");
				}
			}
		}

		if (i < ((b_width*b_height) - b_width)) {
			var bottom = document.getElementById(Number(i)+(b_width));
			if (!bottom.classList.contains("revealed") && adjacent) {
				if (bottom.classList.contains("bomb") && !bottom.classList.contains("flagged") && !bottom.classList.contains("revealed")) {
					//bottom.children[0].remove();
					bottom.children[0].style.visibility = "visible";
					loseGame(bottom);				
				} else {
					if (bottom.classList.contains("0") && !bottom.classList.contains("flagged")) {
						bottom.children[0].style.color = "lightgray";
						bottom.style.border = "none";
					}
					bottom.children[0].style.visibility = "visible";
					bottom.classList.add("revealed");
				}
			}
		}
	}
}