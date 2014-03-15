var Fifteen = (function(window, document, unundefined) {

    var cells = [],
        rowLength = null,
        zero = null,
        stepCount = null;

    return {

        init: function(size) {

            var range = [];

            for (var i = 1; i < size * size; i++) {
                range.push(i);
            }

            cells = this.shuffle(range).concat(0);

            if (!this.haveSolution()) {
                this.init(size);
            }

            rowLength = Math.sqrt(cells.length);
            zero = this.getZeroPosition();
            stepCount = 0;
            this.render();
        },

        shuffle: function (o){
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        },

        isCompleted: function(){
            for(var i = 0; i < cells.length - 1; i++) {
                if (cells[i] != i+1 ) return false;
            }
            return true;
        },

        haveSolution: function(){
            var disorder = 0;
            for(var i = 0; i < cells.length-1; i++) {
                for (var j = i - 1; j >= 0; j--) {
                    if (cells[j] > cells[i]) disorder++;
                }
            }
            return !(disorder % 2);
        },

        swap: function (cellA, cellB) {
            var t = cells[cellA];
            cells[cellA] = cells[cellB];
            cells[cellB] = t;
        },

        getZeroPosition: function (){
            for(var i = 0; i < cells.length; i++  ) {
                if (cells[i] == 0) {
                    return i;
                }
            }
            return false;
        },

        move: function (cell){
            if ((cell < cells.length) && (cell >= 0)) {
                if (zero != cell) {
                    if (Math.abs(zero - cell) == 1 || Math.abs(zero - cell) == rowLength) {
                        if (!(((zero % rowLength == 0) && (cell == zero - 1)) || ((cell % rowLength == 0) && (zero == cell - 1)))) {
                            this.swap(cell, zero);
                            zero = this.getZeroPosition();
                            this.render();
                            stepCount++;
                            if(this.isCompleted()) alert('You are win! Step Count: ' + stepCount);
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        getSolutionForOneStep: function(start, goal, closeNodes) {

            var openSet = [],
                closeSet = [],
                pathMap = [],
                parentNode,
                parentNodeIndex,
                neighborNods,
                tentativeIsBetter,
                tentative,
                tentativeGScore;

            if (closeNodes) {
                for (var i = 0; i < closeNodes.length; i++) {
                    closeSet.push(new Node(Infinity, Infinity, closeNodes[i], null));
                }
            }

            openSet.push(new Node(0, cost(start, goal), start, null));
            
            while (openSet.length != 0) {
                parentNodeIndex = getMinCost(openSet);
                parentNode = openSet[parentNodeIndex];

                if (parentNode.pos == goal) {
                    closeSet.push(new Node(parentNode.pos + 1, 0, goal, closeSet[closeSet.length-1].pos));
                    constructPath(goal);
                    return pathMap;
                }

                closeSet.push(parentNode);
                openSet.splice(parentNodeIndex,1);
                neighborNods = neighborNodes(parentNode);

                for (var i = 0; i < neighborNods.length; i++) {
                    
                    if (nodeByPos(closeSet,neighborNods[i]) !== false) {
                        continue;
                    }

                    tentativeGScore = parentNode.pos; //+ 1;
                    tentative = nodeByPos(openSet, neighborNods[i]);
                    if (!tentative) {
                        openSet.push(new Node(tentativeGScore, cost(neighborNods[i], goal), neighborNods[i], parentNode.pos));
                        tentative = openSet.length - 1;
                        tentativeIsBetter = true;
                    }
                    else {
                        if (tentativeGScore < cost(neighborNods[i], goal)) {
                            tentativeIsBetter = true;
                        }
                        else {
                            tentativeIsBetter = false;
                        }
                    }
                }

                if (tentativeIsBetter == true) {
                    openSet[tentative].cameFrom = parentNode.pos;
                    openSet[tentative].g = tentativeGScore;
                    openSet[tentative].h = cost(tentativeGScore ,goal);
                    openSet[tentative].f = tentativeGScore + cost(tentativeGScore ,goal);
                }
            }
            
            function Node(g, h, pos, parent) {
                return {
                    cameFrom: parent,
                    pos: pos,
                    g: g,
                    h: h,
                    f: g + h
                }
            }

            function constructPath(goal) {
                var currentNode = closeSet[nodeByPos(closeSet ,goal)];
                while (currentNode.cameFrom != null) {
                    pathMap.push(currentNode);
                    currentNode = closeSet[nodeByPos(closeSet, currentNode.cameFrom)];
                }
            }

            function nodeByPos(nodes, pos) {
                for(var i = 0; i < nodes.length; i++) {
                    if(nodes[i].pos == pos) return i;
                }
                return false;
            }

            function neighborNodes(node) {
                var nodes = [];

                if (node.pos + rowLength <= cells.length - 1) nodes.push(node.pos + rowLength);
                if (node.pos - rowLength >= 0) nodes.push(node.pos - rowLength);
                if ((node.pos + 1 <= cells.length - 1) && ((node.pos + 1) % rowLength) != 0) nodes.push(node.pos + 1);
                if ((node.pos - 1 >= 0) && ((node.pos % rowLength) != 0)) nodes.push(node.pos - 1);
                return nodes;
            }

            function cost(start, goal) {
                var cost = 0;
                cost = Math.abs(start - goal);
                return cost;
            }

            function getMinCost(nodes) {
                var min = Infinity,
                    index = null;

                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].f <= min) {
                        min = nodes[i].f
                        index = i;
                    }
                }
                return index;
            }
        },

        getSolutionForZero: function(goal, closeNodes) {
            return this.getSolutionForOneStep(this.getZeroPosition(), goal, closeNodes);
        },

        getSolution: function() {
            
            //for (var i = path.length-1; i >= 0 ;i--) {
            //    this.move(path[i].pos);
            //}

            //while (!this.isCompleted()) {
                var goal = getNextGoal();
                //console.log("goal: " + goal);
                var pathForNum = this.getSolutionForOneStep(getNodeByNum(goal + 1) ,goal);

                for (var i = pathForNum.length-1; i >= 0; i--) {
                    var pathForZero = this.getSolutionForZero(pathForNum[i].pos, [pathForNum[i].cameFrom]);
                    for (var j = pathForZero.length-1; j >= 0; j--) {
                        //console.log(pathForZero[j])
                        this.move(pathForZero[j].pos);
                    }
                    
                    this.move(pathForNum[i].cameFrom);
                    //break;
                    
                }   
                console.log(pathForNum);
                //return pathForNum;
            //}

            function getNextGoal() {
                for (var i = 0; i < cells.length; i++) {
                    if (cells[i] != i) return i; 
                }
            }

            function getNodeByNum(num) {
                for (var i = 0; i < cells.length; i++) {
                    if (cells[i] == num) return i;
                }
            } 
        },

        render: function () {
            var that = this;
            var grid = document.getElementById('grid');
            grid.innerText = "";
            for (var i = 0; i < cells.length; i++) {
                if (cells[i] == 0) {
                    continue;
                }
                var newCell = document.createElement('div');
                newCell.className = 'cell btn btn-default';
                newCell.innerText = cells[i].toString();
                newCell.style.top = parseInt(i / rowLength) * 60 + 10 + 'px';
                newCell.style.left = parseInt(i % rowLength) * 60 + 10 + 'px';

                newCell.onclick = function(index) {
                    return function() { that.move(index) }
                }(i);
                grid.appendChild(newCell);
            }
        }
    }
})(window, document);

window.onload = Fifteen.init(4);