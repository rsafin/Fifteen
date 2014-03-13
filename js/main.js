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

        isCompleted: function() {
            for(var i = 0; i < cells.length - 1; i++) {
                if (cells[i] != i + 1 ) return false;
            }
            return true;
        },

                
        getOneStepSolution: function(start, goal) {
            var closedSet = [],
                openSet = [new Point(start, 0, cost(start, goal), null)],
                pathMap = [];
            
            while (openSet.length != 0) {
                var index =  getMinCost(openSet);
                var parentPoint = openSet[index];
                var tentativeIsBetter; 
                closedSet.push(parentPoint);
                openSet.splice([index], 1);
                var points = neighborPoints(parentPoint);
                for (var i = 0; i < points.length; i++) {
                    if (pointByPos(closedSet, points[i])) continue;
                        var tentativeGScore = parentPoint.g + 1;
                    if (!pointByPos(openSet, points[i])) {
                        //console.log(new Point(points[i], parentPoint.g + 1, cost(points[i] ,goal), parentPoint.pos))
                        openSet.push(new Point(points[i], parentPoint.g + 1, cost(points[i] ,goal), parentPoint.pos)); 
                        tentativeIsBetter = true;
                    } else {
                       if (tentativeGScore < openSet(index).g) {
                            tentativeIsBetter = true;
                       } else {
                           tentativeIsBetter = false;
                       }
                    }
                 }
             }


            //if (tentativeIsBetter) {
            //    var index = pointByPos(openSet, points[i]);
            //    openSet[index].g = parentPoint.pos + 1;
            //    openSet[index].h = cost(point[i], goal);
            //    openSet[index].f = openSet[index].g + openSet[index].h;
            //}
            //console.log(openSet);
            
           
            
            function pointByPos(points, pos) {
                for(var i = 0; i < points.length; i++) {
                    if(points[i].pos == pos) return i;
                }
                return false;
            }
            
            function neighborPoints(point) {
                var points = [];
                if (point.pos + rowLength <= cells.length - 1) points.push(point.pos + rowLength);
                if (point.pos + 1 <= cells.length - 1) points.push(point.pos + 1);
                if (point.pos - rowLength >= 0) points.push(point.pos - rowLength);
                if (point.pos - 1 >= 0) points.push(point.pos - 1);
                return points;
            }

            function getMinCost(points) {
                var tmp = [],
                    min = Infinity,
                    index = null;

                for (var i = 0; i < points.length; i++) {
                    if (points[i].f < min) {
                        min = points[i].f   
                        index = i;
                    }
                }
                return index;
            }

            function Point(pos ,g, h, cameFrom){
                return {
                    cameForm: cameFrom,
                    pos: pos,
                    g: g,
                    h: h,
                    f: g + h
                }
            }

            function cost(start, goal) {
                var cost = 0;
                cost = Math.abs(start - goal);
                return cost;
            }
        },

        haveSolution: function() {
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

        getZeroPosition: function () {
            for(var i = 0; i < cells.length; i++  ) {
                if (cells[i] == 0) {
                    return i;
                }
            }
        },

        move: function (cell) {
            if ((cell < cells.length) && (cell >= 0)) {
                if (zero != cell) {
                    if (Math.abs(zero - cell) == 1 || Math.abs(zero - cell) == rowLength) {
                        this.swap(cell, zero);
                        zero = this.getZeroPosition();
                        this.render();
                        stepCount++;
                        if(this.isCompleted()) alert('You are win! Step Count: ' + stepCount);
                        return true
                    }
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

window.onload = Fifteen.init(3);
