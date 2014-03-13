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
        },

        move: function (cell){
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

window.onload = Fifteen.init(4);