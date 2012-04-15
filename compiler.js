
var convertPitch = function(note) {
    octave = parseInt(note[1]);

    letterPitches = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7,
                      'A': 9, 'B': 11 };
    letterPitch = letterPitches[note[0].toUpperCase()];
    
    return 12 + 12 * octave + letterPitch;
}

var compileT = function(expr, t) {
    note = [];
    
    if (expr.tag === 'note')
    {
        return [ { tag: 'note', pitch: convertPitch(expr.pitch),
                  start: t, dur: expr.dur } ];
    }
    else if (expr.tag === 'rest')
    {
        return [ { tag: 'rest', 
        start: t, dur: expr.dur } ];
    }
    else if (expr.tag === 'repeat')
    {
        for (var count = expr.count;
                 count != 0;
                 --count)
        {
            console.log("t: " + t);
            note = note.concat(compileT(expr.section, t));
            t = note[note.length-1].start + note[note.length-1].dur;      
        }
        return note;
    }

    
    // otherwise it is seq
    note = note.concat(compileT(expr.left, t));
    newtime = note[note.length-1].start + note[note.length-1].dur;
    note = note.concat(compileT(expr.right, newtime));
    
    return note;
};

var compile = function (musexpr) {
    return compileT(musexpr, 0);
};

// original
/*var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };
*/

/*  /// simple repeat 
var melody_mus = 
    { tag: 'seq',
      left: 
      { tag: 'rest', dur: 250 },
      right:
      { tag: 'repeat',
      section: { tag: 'note', pitch: 'c4', dur: 250 },
      count: 3 } };
*/
var melody_mus = 
    { tag: 'seq',
      left: 
      { tag: 'rest', dur: 250 },
      right:
      { tag: 'repeat',
      section: { tag: 'seq',
      left: { tag: 'note', pitch: 'c4', dur: 500 },
      right: { tag: 'note', pitch: 'd4', dur: 500 } },
      count: 3 } };

console.log(melody_mus);
console.log(compile(melody_mus));
