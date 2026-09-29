export const supportedLanguages = [
  {
    id: 'cpp',
    name: 'C++',
    version: 'GCC 14 (C++20)',
    monacoLang: 'cpp',
    ext: 'cpp',
    fileName: 'main.cpp',
    badge: 'C++',
    color: '#00599c',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n = 5;
    int sum = 0;
    
    // Calculate sum of first n natural numbers
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    
    cout << "Calculation complete!" << endl;
    cout << "Sum of first " << n << " numbers = " << sum << endl;
    return 0;
}`,
    stdin: '',
    output: `Calculation complete!\nSum of first 5 numbers = 15\n\n[Process completed with exit code 0 - Execution time: 12ms]`,
    variables: ['n', 'i', 'sum'],
    trace: [
      {
        step: 1,
        line: 5,
        statement: 'int n = 5;',
        vars: { n: 5, i: '-', sum: '-' },
        source: 'Constant literal 5',
        target: 'Variable n',
        operation: 'Assign n = 5',
        travel: 'Value 5 stored into memory register [n]',
        note: 'Initialize target bound n = 5'
      },
      {
        step: 2,
        line: 6,
        statement: 'int sum = 0;',
        vars: { n: 5, i: '-', sum: 0 },
        source: 'Constant literal 0',
        target: 'Variable sum',
        operation: 'Assign sum = 0',
        travel: 'Value 0 stored into memory register [sum]',
        note: 'Initialize accumulator sum = 0'
      },
      {
        step: 3,
        line: 9,
        statement: 'int i = 1; (i <= n is TRUE)',
        vars: { n: 5, i: 1, sum: 0 },
        source: 'Loop init i = 1',
        target: 'Variable i',
        operation: '1 <= 5 (True)',
        travel: 'Value 1 assigned to counter [i]',
        note: 'Loop begins: 1 <= 5 is True'
      },
      {
        step: 4,
        line: 10,
        statement: 'sum += i;',
        vars: { n: 5, i: 1, sum: 1 },
        source: 'sum (0) + i (1)',
        target: 'Variable sum',
        operation: '0 + 1 ➔ 1',
        travel: 'Value 1 from [i] added to [sum]: 0 ➔ 1',
        note: 'sum updated: 0 ➔ 1'
      },
      {
        step: 5,
        line: 9,
        statement: 'i++ => 2 (i <= n is TRUE)',
        vars: { n: 5, i: 2, sum: 1 },
        source: 'i (1) + 1',
        target: 'Variable i',
        operation: '1 + 1 ➔ 2',
        travel: 'Counter [i] incremented: 1 ➔ 2',
        note: 'Next iteration: 2 <= 5 is True'
      },
      {
        step: 6,
        line: 10,
        statement: 'sum += i;',
        vars: { n: 5, i: 2, sum: 3 },
        source: 'sum (1) + i (2)',
        target: 'Variable sum',
        operation: '1 + 2 ➔ 3',
        travel: 'Value 2 from [i] added to [sum]: 1 ➔ 3',
        note: 'sum updated: 1 ➔ 3'
      },
      {
        step: 7,
        line: 9,
        statement: 'i++ => 3 (i <= n is TRUE)',
        vars: { n: 5, i: 3, sum: 3 },
        source: 'i (2) + 1',
        target: 'Variable i',
        operation: '2 + 1 ➔ 3',
        travel: 'Counter [i] incremented: 2 ➔ 3',
        note: 'Next iteration: 3 <= 5 is True'
      },
      {
        step: 8,
        line: 10,
        statement: 'sum += i;',
        vars: { n: 5, i: 3, sum: 6 },
        source: 'sum (3) + i (3)',
        target: 'Variable sum',
        operation: '3 + 3 ➔ 6',
        travel: 'Value 3 from [i] added to [sum]: 3 ➔ 6',
        note: 'sum updated: 3 ➔ 6'
      },
      {
        step: 9,
        line: 9,
        statement: 'i++ => 4 (i <= n is TRUE)',
        vars: { n: 5, i: 4, sum: 6 },
        source: 'i (3) + 1',
        target: 'Variable i',
        operation: '3 + 1 ➔ 4',
        travel: 'Counter [i] incremented: 3 ➔ 4',
        note: 'Next iteration: 4 <= 5 is True'
      },
      {
        step: 10,
        line: 10,
        statement: 'sum += i;',
        vars: { n: 5, i: 4, sum: 10 },
        source: 'sum (6) + i (4)',
        target: 'Variable sum',
        operation: '6 + 4 ➔ 10',
        travel: 'Value 4 from [i] added to [sum]: 6 ➔ 10',
        note: 'sum updated: 6 ➔ 10'
      },
      {
        step: 11,
        line: 9,
        statement: 'i++ => 5 (i <= n is TRUE)',
        vars: { n: 5, i: 5, sum: 10 },
        source: 'i (4) + 1',
        target: 'Variable i',
        operation: '4 + 1 ➔ 5',
        travel: 'Counter [i] incremented: 4 ➔ 5',
        note: 'Final loop iteration: 5 <= 5 is True'
      },
      {
        step: 12,
        line: 10,
        statement: 'sum += i;',
        vars: { n: 5, i: 5, sum: 15 },
        source: 'sum (10) + i (5)',
        target: 'Variable sum',
        operation: '10 + 5 ➔ 15',
        travel: 'Value 5 from [i] added to [sum]: 10 ➔ 15',
        note: 'Final sum accumulated: 10 ➔ 15'
      },
      {
        step: 13,
        line: 9,
        statement: 'i++ => 6 (i <= n is FALSE)',
        vars: { n: 5, i: 6, sum: 15 },
        source: 'i (5) + 1',
        target: 'Condition Check',
        operation: '6 <= 5 (False)',
        travel: 'Loop condition fails: 6 > 5',
        note: 'Loop terminates'
      },
      {
        step: 14,
        line: 14,
        statement: 'cout << sum',
        vars: { n: 5, i: 6, sum: 15 },
        source: 'sum (15)',
        target: 'Stdout Console',
        operation: 'Output stream',
        travel: 'Value 15 from [sum] sent to Terminal output',
        note: 'Print result: 15'
      },
    ],
    flowchart: [
      { id: 'start', type: 'terminal', label: 'Start Program', code: 'main()', next: 'init' },
      { id: 'init', type: 'process', label: 'Initialize n = 5, sum = 0', code: 'int n = 5; int sum = 0;', next: 'loop_init' },
      { id: 'loop_init', type: 'process', label: 'Set loop counter i = 1', code: 'int i = 1;', next: 'decision' },
      { id: 'decision', type: 'decision', label: 'Is i <= n ? (Condition check)', code: 'i <= n', nextTrue: 'body', nextFalse: 'print' },
      { id: 'body', type: 'process', label: 'Add i to sum (sum += i)', code: 'sum += i;', next: 'increment' },
      { id: 'increment', type: 'process', label: 'Increment counter (i++)', code: 'i++;', next: 'decision' },
      { id: 'print', type: 'io', label: 'Output: Print Total Sum', code: 'cout << sum;', next: 'end' },
      { id: 'end', type: 'terminal', label: 'End / return 0', code: 'return 0;', next: null }
    ]
  },
  {
    id: 'c',
    name: 'C',
    version: 'GCC 13 (C17)',
    monacoLang: 'c',
    ext: 'c',
    fileName: 'main.c',
    badge: 'C',
    color: '#555555',
    starterCode: `#include <stdio.h>

int main() {
    int n = 5;
    int factorial = 1;
    
    // Compute factorial step by step
    for (int i = 1; i <= n; i++) {
        factorial *= i;
    }
    
    printf("Factorial of %d = %d\\n", n, factorial);
    return 0;
}`,
    stdin: '',
    output: `Factorial of 5 = 120\n\n[Process completed with exit code 0 - Execution time: 9ms]`,
    variables: ['n', 'i', 'factorial'],
    trace: [
      { step: 1, line: 4, statement: 'int n = 5;', vars: { n: 5, i: '-', factorial: '-' }, source: 'Constant 5', target: 'Variable n', operation: 'n = 5', travel: 'Constant 5 stored into [n]', note: 'Define input n' },
      { step: 2, line: 5, statement: 'int factorial = 1;', vars: { n: 5, i: '-', factorial: 1 }, source: 'Constant 1', target: 'Variable factorial', operation: 'factorial = 1', travel: '1 stored into [factorial]', note: 'Define product accumulator' },
      { step: 3, line: 8, statement: 'i = 1; (i <= 5 is TRUE)', vars: { n: 5, i: 1, factorial: 1 }, source: 'Loop init i = 1', target: 'Variable i', operation: '1 <= 5', travel: 'Counter [i] set to 1', note: 'Loop begins' },
      { step: 4, line: 9, statement: 'factorial *= 1', vars: { n: 5, i: 1, factorial: 1 }, source: 'factorial (1) * i (1)', target: 'Variable factorial', operation: '1 * 1 ➔ 1', travel: 'Multiply by i (1): factorial = 1', note: 'factorial remains 1' },
      { step: 5, line: 8, statement: 'i++ => 2', vars: { n: 5, i: 2, factorial: 1 }, source: 'i (1) + 1', target: 'Variable i', operation: '1 + 1 ➔ 2', travel: 'Counter [i] incremented: 1 ➔ 2', note: 'Loop check: 2 <= 5' },
      { step: 6, line: 9, statement: 'factorial *= 2', vars: { n: 5, i: 2, factorial: 2 }, source: 'factorial (1) * i (2)', target: 'Variable factorial', operation: '1 * 2 ➔ 2', travel: 'Multiply [factorial] by 2: 1 ➔ 2', note: 'factorial updated: 2' },
      { step: 7, line: 8, statement: 'i++ => 3', vars: { n: 5, i: 3, factorial: 2 }, source: 'i (2) + 1', target: 'Variable i', operation: '2 + 1 ➔ 3', travel: 'Counter [i] incremented: 2 ➔ 3', note: 'Loop check: 3 <= 5' },
      { step: 8, line: 9, statement: 'factorial *= 3', vars: { n: 5, i: 3, factorial: 6 }, source: 'factorial (2) * i (3)', target: 'Variable factorial', operation: '2 * 3 ➔ 6', travel: 'Multiply [factorial] by 3: 2 ➔ 6', note: 'factorial updated: 6' },
      { step: 9, line: 8, statement: 'i++ => 4', vars: { n: 5, i: 4, factorial: 6 }, source: 'i (3) + 1', target: 'Variable i', operation: '3 + 1 ➔ 4', travel: 'Counter [i] incremented: 3 ➔ 4', note: 'Loop check: 4 <= 5' },
      { step: 10, line: 9, statement: 'factorial *= 4', vars: { n: 5, i: 4, factorial: 24 }, source: 'factorial (6) * i (4)', target: 'Variable factorial', operation: '6 * 4 ➔ 24', travel: 'Multiply [factorial] by 4: 6 ➔ 24', note: 'factorial updated: 24' },
      { step: 11, line: 8, statement: 'i++ => 5', vars: { n: 5, i: 5, factorial: 24 }, source: 'i (4) + 1', target: 'Variable i', operation: '4 + 1 ➔ 5', travel: 'Counter [i] incremented: 4 ➔ 5', note: 'Final loop step' },
      { step: 12, line: 9, statement: 'factorial *= 5', vars: { n: 5, i: 5, factorial: 120 }, source: 'factorial (24) * i (5)', target: 'Variable factorial', operation: '24 * 5 ➔ 120', travel: 'Multiply [factorial] by 5: 24 ➔ 120', note: 'factorial updated: 120' },
      { step: 13, line: 8, statement: 'i++ => 6 (i <= 5 is FALSE)', vars: { n: 5, i: 6, factorial: 120 }, source: 'i (5) + 1', target: 'Loop Check', operation: '6 <= 5 (False)', travel: 'Condition 6 <= 5 fails', note: 'Exit loop' },
      { step: 14, line: 12, statement: 'printf("Factorial = %d", factorial)', vars: { n: 5, i: 6, factorial: 120 }, source: 'factorial (120)', target: 'Terminal Output', operation: 'printf output', travel: 'Output 120 printed to terminal', note: 'Print result' },
    ],
    flowchart: [
      { id: 'start', type: 'terminal', label: 'Start Program', code: 'main()', next: 'init' },
      { id: 'init', type: 'process', label: 'Initialize n = 5, factorial = 1', code: 'int n = 5; int factorial = 1;', next: 'loop_init' },
      { id: 'loop_init', type: 'process', label: 'Initialize counter i = 1', code: 'int i = 1;', next: 'decision' },
      { id: 'decision', type: 'decision', label: 'Is i <= n ?', code: 'i <= n', nextTrue: 'body', nextFalse: 'print' },
      { id: 'body', type: 'process', label: 'Multiply factorial by i', code: 'factorial *= i;', next: 'increment' },
      { id: 'increment', type: 'process', label: 'Increment counter i++', code: 'i++;', next: 'decision' },
      { id: 'print', type: 'io', label: 'Output Factorial result', code: 'printf("%d", factorial);', next: 'end' },
      { id: 'end', type: 'terminal', label: 'End Program', code: 'return 0;', next: null }
    ]
  },
  {
    id: 'python',
    name: 'Python',
    version: 'Python 3.12',
    monacoLang: 'python',
    ext: 'py',
    fileName: 'main.py',
    badge: 'PY',
    color: '#3776ab',
    starterCode: `# Python 3 Algorithm Simulation
def calculate_metrics():
    numbers = [10, 25, 4, 32, 18]
    maximum = numbers[0]
    total = 0

    for idx, num in enumerate(numbers):
        total += num
        if num > maximum:
            maximum = num

    print(f"Total: {total}, Max: {maximum}")

calculate_metrics()
`,
    stdin: '',
    output: `Total: 89, Max: 32\n\n[Process completed with exit code 0 - Execution time: 18ms]`,
    variables: ['idx', 'num', 'total', 'maximum'],
    trace: [
      { step: 1, line: 3, statement: 'numbers = [10, 25, 4, 32, 18]', vars: { idx: '-', num: '-', total: 0, maximum: 10 }, source: 'List numbers', target: 'maximum = 10', operation: 'maximum = 10', travel: 'numbers[0] (10) stored into [maximum]', note: 'Load list & set maximum = 10' },
      { step: 2, line: 7, statement: 'Loop: idx=0, num=10', vars: { idx: 0, num: 10, total: 10, maximum: 10 }, source: 'num = 10', target: 'total += 10', operation: '0 + 10 ➔ 10', travel: 'Value 10 travels into [total]: 0 ➔ 10', note: 'total = 10' },
      { step: 3, line: 7, statement: 'Loop: idx=1, num=25', vars: { idx: 1, num: 25, total: 35, maximum: 25 }, source: 'num = 25 > 10', target: 'maximum = 25', operation: 'total: 10 + 25 ➔ 35', travel: '25 travels into [maximum] & [total]', note: 'maximum updated: 10 ➔ 25' },
      { step: 4, line: 7, statement: 'Loop: idx=2, num=4', vars: { idx: 2, num: 4, total: 39, maximum: 25 }, source: 'num = 4 <= 25', target: 'total += 4', operation: '35 + 4 ➔ 39', travel: 'Value 4 travels into [total]: 35 ➔ 39', note: 'maximum remains 25' },
      { step: 5, line: 7, statement: 'Loop: idx=3, num=32', vars: { idx: 3, num: 32, total: 71, maximum: 32 }, source: 'num = 32 > 25', target: 'maximum = 32', operation: 'total: 39 + 32 ➔ 71', travel: '32 travels into [maximum] & [total]', note: 'maximum updated: 25 ➔ 32' },
      { step: 6, line: 7, statement: 'Loop: idx=4, num=18', vars: { idx: 4, num: 18, total: 89, maximum: 32 }, source: 'num = 18 <= 32', target: 'total += 18', operation: '71 + 18 ➔ 89', travel: 'Value 18 travels into [total]: 71 ➔ 89', note: 'total = 89, maximum remains 32' },
      { step: 7, line: 12, statement: 'print(...)', vars: { idx: 4, num: 18, total: 89, maximum: 32 }, source: 'total (89), maximum (32)', target: 'Stdout', operation: 'print formatted', travel: 'Values travel to terminal output', note: 'Output printed' },
    ],
    flowchart: [
      { id: 'start', type: 'terminal', label: 'Start Python Script', code: 'def calculate_metrics()', next: 'init' },
      { id: 'init', type: 'process', label: 'Initialize list, max, total', code: 'numbers, maximum, total', next: 'loop_check' },
      { id: 'loop_check', type: 'decision', label: 'More items in numbers list?', code: 'for num in numbers:', nextTrue: 'accumulate', nextFalse: 'print' },
      { id: 'accumulate', type: 'process', label: 'total = total + num', code: 'total += num', next: 'cond_max' },
      { id: 'cond_max', type: 'decision', label: 'Is num > maximum?', code: 'if num > maximum:', nextTrue: 'update_max', nextFalse: 'loop_check' },
      { id: 'update_max', type: 'process', label: 'Update maximum = num', code: 'maximum = num', next: 'loop_check' },
      { id: 'print', type: 'io', label: 'Print Results (Stdout)', code: 'print(...)', next: 'end' },
      { id: 'end', type: 'terminal', label: 'Finish Execution', code: 'sys.exit(0)', next: null }
    ]
  },
  {
    id: 'java',
    name: 'Java',
    version: 'OpenJDK 21',
    monacoLang: 'java',
    ext: 'java',
    fileName: 'Main.java',
    badge: 'JAVA',
    color: '#b07219',
    starterCode: `public class Main {
    public static void main(String[] args) {
        int a = 12;
        int b = 18;
        int gcd = 1;
        
        // Find Greatest Common Divisor (GCD)
        for (int i = 1; i <= a && i <= b; i++) {
            if (a % i == 0 && b % i == 0) {
                gcd = i;
            }
        }
        
        System.out.println("GCD of " + a + " and " + b + " = " + gcd);
    }
}`,
    stdin: '',
    output: `GCD of 12 and 18 = 6\n\n[Process completed with exit code 0 - Execution time: 45ms]`,
    variables: ['a', 'b', 'i', 'gcd'],
    trace: [
      { step: 1, line: 3, statement: 'int a = 12; int b = 18;', vars: { a: 12, b: 18, i: '-', gcd: 1 }, source: 'Constants 12, 18', target: 'a, b', operation: 'a=12, b=18', travel: '12 and 18 stored into registers [a] and [b]', note: 'Declare inputs' },
      { step: 2, line: 8, statement: 'i = 1 (12%1 == 0 && 18%1 == 0)', vars: { a: 12, b: 18, i: 1, gcd: 1 }, source: 'Common divisor 1', target: 'gcd', operation: 'gcd = 1', travel: '1 divides both 12 and 18: stored into [gcd]', note: 'Common factor found: 1' },
      { step: 3, line: 8, statement: 'i = 2 (12%2 == 0 && 18%2 == 0)', vars: { a: 12, b: 18, i: 2, gcd: 2 }, source: 'Common divisor 2', target: 'gcd', operation: 'gcd: 1 ➔ 2', travel: '2 divides both: [gcd] updated: 1 ➔ 2', note: 'Common factor found: 2' },
      { step: 4, line: 8, statement: 'i = 3 (12%3 == 0 && 18%3 == 0)', vars: { a: 12, b: 18, i: 3, gcd: 3 }, source: 'Common divisor 3', target: 'gcd', operation: 'gcd: 2 ➔ 3', travel: '3 divides both: [gcd] updated: 2 ➔ 3', note: 'Common factor found: 3' },
      { step: 5, line: 8, statement: 'i = 6 (12%6 == 0 && 18%6 == 0)', vars: { a: 12, b: 18, i: 6, gcd: 6 }, source: 'Common divisor 6', target: 'gcd', operation: 'gcd: 3 ➔ 6', travel: '6 divides both: [gcd] updated: 3 ➔ 6', note: 'Greatest common factor found: 6' },
      { step: 6, line: 15, statement: 'System.out.println(gcd)', vars: { a: 12, b: 18, i: 13, gcd: 6 }, source: 'gcd (6)', target: 'Stdout', operation: 'print', travel: 'Value 6 sent to console output', note: 'Output GCD = 6' },
    ],
    flowchart: [
      { id: 'start', type: 'terminal', label: 'Main Class Entry', code: 'public static void main(...)', next: 'init' },
      { id: 'init', type: 'process', label: 'Set a = 12, b = 18, gcd = 1', code: 'int a = 12, b = 18, gcd = 1;', next: 'loop_check' },
      { id: 'loop_check', type: 'decision', label: 'i <= a AND i <= b ?', code: 'i <= a && i <= b', nextTrue: 'div_check', nextFalse: 'print' },
      { id: 'div_check', type: 'decision', label: 'a % i == 0 AND b % i == 0 ?', code: 'a%i == 0 && b%i == 0', nextTrue: 'update_gcd', nextFalse: 'next_i' },
      { id: 'update_gcd', type: 'process', label: 'Update gcd = i', code: 'gcd = i;', next: 'next_i' },
      { id: 'next_i', type: 'process', label: 'i++', code: 'i++;', next: 'loop_check' },
      { id: 'print', type: 'io', label: 'Print GCD Result', code: 'System.out.println(gcd);', next: 'end' },
      { id: 'end', type: 'terminal', label: 'Exit Main', code: 'return;', next: null }
    ]
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    version: 'Node.js 22 LTS',
    monacoLang: 'javascript',
    ext: 'js',
    fileName: 'index.js',
    badge: 'JS',
    color: '#f7df1e',
    starterCode: `// Array Reversal & Two-Pointer Trace
function reverseArray(arr) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left < right) {
        let temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        
        left++;
        right--;
    }
    
    return arr;
}

const list = [1, 2, 3, 4, 5];
console.log("Reversed:", reverseArray([...list]));
`,
    stdin: '',
    output: `Reversed: [ 5, 4, 3, 2, 1 ]\n\n[Process completed with exit code 0 - Execution time: 8ms]`,
    variables: ['left', 'right', 'temp', 'arr[left]', 'arr[right]'],
    trace: [
      { step: 1, line: 3, statement: 'left = 0, right = 4', vars: { left: 0, right: 4, temp: '-', 'arr[left]': 1, 'arr[right]': 5 }, source: 'Pointers 0 and 4', target: 'left, right', operation: 'Init pointers', travel: 'Pointers initialized at ends of array', note: 'Start two pointers' },
      { step: 2, line: 7, statement: 'Swap arr[0] (1) with arr[4] (5)', vars: { left: 0, right: 4, temp: 1, 'arr[left]': 5, 'arr[right]': 1 }, source: 'arr[0] ⇄ arr[4]', target: 'Memory swap', operation: '1 ⇄ 5', travel: '1 travels to temp, 5 travels to arr[0], 1 travels to arr[4]', note: 'Swap elements' },
      { step: 3, line: 11, statement: 'left++ => 1, right-- => 3', vars: { left: 1, right: 3, temp: 1, 'arr[left]': 2, 'arr[right]': 4 }, source: 'left+1, right-1', target: 'left, right', operation: 'Shift pointers', travel: 'left shifts 0 ➔ 1; right shifts 4 ➔ 3', note: 'Shift inwards' },
      { step: 4, line: 7, statement: 'Swap arr[1] (2) with arr[3] (4)', vars: { left: 1, right: 3, temp: 2, 'arr[left]': 4, 'arr[right]': 2 }, source: 'arr[1] ⇄ arr[3]', target: 'Memory swap', operation: '2 ⇄ 4', travel: '2 travels to temp, 4 travels to arr[1], 2 travels to arr[3]', note: 'Swap elements' },
      { step: 5, line: 11, statement: 'left++ => 2, right-- => 2', vars: { left: 2, right: 2, temp: 2, 'arr[left]': 3, 'arr[right]': 3 }, source: 'Pointers meet', target: 'left == right', operation: '2 == 2', travel: 'Pointers meet in the middle at index 2', note: 'Loop ends' },
      { step: 6, line: 15, statement: 'return arr', vars: { left: 2, right: 2, temp: 2, 'arr[left]': 3, 'arr[right]': 3 }, source: 'arr', target: 'Return output', operation: 'Return [5,4,3,2,1]', travel: 'Reversed array returned to caller', note: 'Complete' },
    ],
    flowchart: [
      { id: 'start', type: 'terminal', label: 'Start function reverseArray(arr)', code: 'reverseArray(arr)', next: 'init' },
      { id: 'init', type: 'process', label: 'left = 0, right = arr.length - 1', code: 'let left = 0; let right = arr.length - 1;', next: 'decision' },
      { id: 'decision', type: 'decision', label: 'Is left < right ?', code: 'left < right', nextTrue: 'swap', nextFalse: 'ret' },
      { id: 'swap', type: 'process', label: 'Swap arr[left] & arr[right]', code: 'temp = arr[left]; arr[left] = arr[right];', next: 'shift' },
      { id: 'shift', type: 'process', label: 'left++, right--', code: 'left++; right--;', next: 'decision' },
      { id: 'ret', type: 'io', label: 'Return reversed array', code: 'return arr;', next: 'end' },
      { id: 'end', type: 'terminal', label: 'End Function', code: 'console.log()', next: null }
    ]
  },
  {
    id: 'rust',
    name: 'Rust',
    version: 'Rustc 1.76',
    monacoLang: 'rust',
    ext: 'rs',
    fileName: 'main.rs',
    badge: 'RS',
    color: '#dea584',
    starterCode: `fn main() {
    let mut sum: i32 = 0;
    let limit: i32 = 5;

    for i in 1..=limit {
        sum += i;
    }

    println!("Sum from 1 to {} is {}", limit, sum);
}
`,
    stdin: '',
    output: `Sum from 1 to 5 is 15\n\n[Process completed with exit code 0 - Execution time: 5ms]`,
    variables: ['limit', 'i', 'sum'],
    trace: [
      { step: 1, line: 2, statement: 'let mut sum = 0;', vars: { limit: 5, i: '-', sum: 0 }, source: '0', target: 'sum', operation: 'sum = 0', travel: '0 assigned to mutable [sum]', note: 'Init sum' },
      { step: 2, line: 5, statement: 'i = 1 (sum += 1)', vars: { limit: 5, i: 1, sum: 1 }, source: 'i (1)', target: 'sum', operation: '0 + 1 ➔ 1', travel: '1 travels to [sum]: 0 ➔ 1', note: 'Accumulate sum = 1' },
      { step: 3, line: 5, statement: 'i = 2 (sum += 2)', vars: { limit: 5, i: 2, sum: 3 }, source: 'i (2)', target: 'sum', operation: '1 + 2 ➔ 3', travel: '2 travels to [sum]: 1 ➔ 3', note: 'Accumulate sum = 3' },
      { step: 4, line: 5, statement: 'i = 3 (sum += 3)', vars: { limit: 5, i: 3, sum: 6 }, source: 'i (3)', target: 'sum', operation: '3 + 3 ➔ 6', travel: '3 travels to [sum]: 3 ➔ 6', note: 'Accumulate sum = 6' },
      { step: 5, line: 5, statement: 'i = 4 (sum += 4)', vars: { limit: 5, i: 4, sum: 10 }, source: 'i (4)', target: 'sum', operation: '6 + 4 ➔ 10', travel: '4 travels to [sum]: 6 ➔ 10', note: 'Accumulate sum = 10' },
      { step: 6, line: 5, statement: 'i = 5 (sum += 5)', vars: { limit: 5, i: 5, sum: 15 }, source: 'i (5)', target: 'sum', operation: '10 + 5 ➔ 15', travel: '5 travels to [sum]: 10 ➔ 15', note: 'Accumulate sum = 15' },
      { step: 7, line: 9, statement: 'println!(...)', vars: { limit: 5, i: 5, sum: 15 }, source: 'sum (15)', target: 'Stdout', operation: 'println', travel: '15 printed to terminal output', note: 'Complete' },
    ],
    flowchart: [
      { id: 'start', type: 'terminal', label: 'fn main() Entry', code: 'fn main()', next: 'init' },
      { id: 'init', type: 'process', label: 'Initialize sum = 0, limit = 5', code: 'let mut sum = 0;', next: 'loop' },
      { id: 'loop', type: 'decision', label: 'More items in range 1..=limit ?', code: 'for i in 1..=limit', nextTrue: 'body', nextFalse: 'print' },
      { id: 'body', type: 'process', label: 'sum += i', code: 'sum += i;', next: 'loop' },
      { id: 'print', type: 'io', label: 'println!(...)', code: 'println!(...)', next: 'end' },
      { id: 'end', type: 'terminal', label: 'End Program', code: '()', next: null }
    ]
  },
  {
    id: 'go',
    name: 'Go',
    version: 'Go 1.22',
    monacoLang: 'go',
    ext: 'go',
    fileName: 'main.go',
    badge: 'GO',
    color: '#00add8',
    starterCode: `package main
import "fmt"

func main() {
    count := 5
    total := 0
    
    for i := 1; i <= count; i++ {
        total += i * 2
    }
    
    fmt.Printf("Total of even sequence up to %d = %d\\n", count, total)
}
`,
    stdin: '',
    output: `Total of even sequence up to 5 = 30\n\n[Process completed with exit code 0 - Execution time: 10ms]`,
    variables: ['count', 'i', 'total'],
    trace: [
      { step: 1, line: 5, statement: 'count := 5; total := 0', vars: { count: 5, i: '-', total: 0 }, source: '5, 0', target: 'count, total', operation: 'Init', travel: '5 and 0 stored in memory', note: 'Initialize variables' },
      { step: 2, line: 8, statement: 'i := 1', vars: { count: 5, i: 1, total: 2 }, source: 'i*2 (2)', target: 'total', operation: '0 + 2 ➔ 2', travel: '2 travels into [total]: 0 ➔ 2', note: 'total = 2' },
      { step: 3, line: 8, statement: 'i := 2', vars: { count: 5, i: 2, total: 6 }, source: 'i*2 (4)', target: 'total', operation: '2 + 4 ➔ 6', travel: '4 travels into [total]: 2 ➔ 6', note: 'total = 6' },
      { step: 4, line: 8, statement: 'i := 3', vars: { count: 5, i: 3, total: 12 }, source: 'i*2 (6)', target: 'total', operation: '6 + 6 ➔ 12', travel: '6 travels into [total]: 6 ➔ 12', note: 'total = 12' },
      { step: 5, line: 8, statement: 'i := 4', vars: { count: 5, i: 4, total: 20 }, source: 'i*2 (8)', target: 'total', operation: '12 + 8 ➔ 20', travel: '8 travels into [total]: 12 ➔ 20', note: 'total = 20' },
      { step: 6, line: 8, statement: 'i := 5', vars: { count: 5, i: 5, total: 30 }, source: 'i*2 (10)', target: 'total', operation: '20 + 10 ➔ 30', travel: '10 travels into [total]: 20 ➔ 30', note: 'total = 30' },
      { step: 7, line: 12, statement: 'fmt.Printf(...)', vars: { count: 5, i: 5, total: 30 }, source: 'total (30)', target: 'Stdout', operation: 'Printf', travel: '30 printed to terminal output', note: 'Printed output: 30' },
    ],
    flowchart: [
      { id: 'start', type: 'terminal', label: 'func main() Entry', code: 'func main()', next: 'init' },
      { id: 'init', type: 'process', label: 'count := 5, total := 0', code: 'count := 5; total := 0', next: 'loop_check' },
      { id: 'loop_check', type: 'decision', label: 'i <= count ?', code: 'i <= count', nextTrue: 'body', nextFalse: 'print' },
      { id: 'body', type: 'process', label: 'total += i * 2', code: 'total += i * 2', next: 'loop_check' },
      { id: 'print', type: 'io', label: 'fmt.Printf(...)', code: 'fmt.Printf(...)', next: 'end' },
      { id: 'end', type: 'terminal', label: 'End Program', code: 'return', next: null }
    ]
  }
];
