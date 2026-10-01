export const codeExamples = [
  {
    title: 'Hello World',
    code: `module playground

import std.io

func main() {
    println("Hello, world!")
}`,
  },
  {
    title: 'Variables',
    code: `module playground

import std.io

func main() {
    // Mutable binding
    var count = 0

    // Immutable binding
    fin name = "Azora"
    fin greeting = "Hello, \${name}!"

    // A bracket literal with no other context builds an Array
    fin items = [1, 2, 3, 4, 5]
    count = items.size

    println(greeting)
    println("\${count} items")
}`,
  },
  {
    title: 'Functions & Lambdas',
    code: `module playground

import std.io

// Named function with return type
func add(a: Int, b: Int): Int {
    return a + b
}

// Single-expression function
func square(x: Int): Int = x * x

// Higher-order function: a callable type is written as its signature
func apply(value: Int, transform: (Int) -> Int): Int {
    return transform(value)
}

func main() {
    println(add(3, 4))
    println(square(5))

    // Lambda
    fin double = { x: Int -> x * 2 }
    println(apply(5, double))
}`,
  },
  {
    title: 'Tuples',
    code: `module playground

import std.io
import std.container.tuple

func divmod(a: Int, b: Int): (Int, Int) {
    return (a / b, a % b)
}

func main() {
    // Tuple literal
    fin pair = (42, "hello")
    println(pair.0)
    println(pair.1)

    // Tuple as return value
    fin result = divmod(17, 5)
    println("quotient: \${result.0}")
    println("remainder: \${result.1}")

    // Nested tuple
    fin nested = (1, (2, 3), "end")
    fin inner = nested.1
    println(inner.0)
}`,
  },
  {
    title: 'Packs & Enums',
    code: `module playground

import std.io

pack Point {
    var x: Double
    var y: Double
}

enum Direction {
    North
    South
    East
    West
}

func main() {
    fin p = Point(3.0, 4.0)
    fin origin = Point(0.0, 0.0)

    fin dx = p.x - origin.x
    fin dy = p.y - origin.y
    println("Distance squared: \${dx * dx + dy * dy}")

    fin dir = Direction.North
    println(dir)
}`,
  },
  {
    title: 'Variant Enums',
    code: `module playground

import std.io

variant enum Shape {
    Circle(radius: Double)
    Rectangle(width: Double, height: Double)
    Point
}

func describe(shape: Shape): String {
    return when shape {
        .Circle(radius) -> "circle with r=\${radius}"
        .Rectangle(width, height) -> "rect \${width}x\${height}"
        else -> "point"
    }
}

func main() {
    fin c = Shape.Circle(5.0)
    fin r = Shape.Rectangle(3.0, 4.0)

    println(describe(c))
    println(describe(r))
    println(describe(Shape.Point))
}`,
  },
  {
    title: 'Generics',
    code: `module playground

import std.io

pack Pair<A, B> {
    var first: A
    var second: B
}

func<A, B> swap(pair: Pair<A, B>): Pair<B, A> {
    return Pair(pair.second, pair.first)
}

func main() {
    fin p = Pair<String, Int>("hello", 42)
    println("\${p.first}, \${p.second}")

    fin s = swap<String, Int>(p)
    println("\${s.first}, \${s.second}")
}`,
  },
  {
    title: 'Async / Await',
    code: `module playground

import std.io

async func main() {
    // \`async { … }\` starts work; the handle is awaited for its result.
    fin a = async { "Hello, Alice!" }
    fin b = async { "Hello, Bob!" }

    // Await both results
    println(await a)
    println(await b)
}`,
  },
  {
    title: 'Flows',
    code: `module playground

import std.io
import std.container.list
import std.concurrency.generators

// A producer stays an ordinary \`func\`; its return type says it yields a stream.
func upTo(n: Int): Sequence<Int> = sequence<Int> [!] s: SequenceScope<Int> {
    for i in 0..<n {
        yield(i)
    }
}

func evens(n: Int): Sequence<Int> = sequence<Int> [!] s: SequenceScope<Int> {
    for i in 0..<n {
        if i % 2 == 0 {
            yield(i)
        }
    }
}

func main() {
    fin numbers = upTo(5).items
    var sum = 0
    for i in 0..<numbers.size {
        sum = sum + numbers[i]
    }
    println("Sum 0..<5: \${sum}")

    fin even = evens(10).items
    for i in 0..<even.size {
        println(even[i])
    }
}`,
  },
  {
    title: 'Testing',
    code: `module playground

func factorial(n: Int): Int {
    if n <= 1 { return 1 }
    return n * factorial(n - 1)
}

test "factorial of 0 is 1" {
    assert factorial(0) == 1 panic "0! should be 1"
}

test "factorial of 5 is 120" {
    assert factorial(5) == 120 panic "5! should be 120"
}

test "factorial of 1 is 1" {
    assert factorial(1) == 1 panic "1! should be 1"
}`,
  },
  {
    title: 'Error Handling',
    code: `module playground

import std.io

error MathError {
    DivisionByZero
    Overflow
}

func safeDivide(a: Int, b: Int): Int ?! MathError {
    if b == 0 { return .DivisionByZero }
    return a / b
}

func main() {
    // Catch with a default value
    fin result = safeDivide(10, 0) catch -1
    println("10 / 0 = \${result}")

    // Successful division
    fin ok = safeDivide(10, 2) catch 0
    println("10 / 2 = \${ok}")
}`,
  },
  {
    title: 'Contracts',
    code: `module playground

func clamp(x: Int, lo: Int, hi: Int): Int
in {
    assert lo <= hi panic "lo must be <= hi"
} out {
    assert it >= lo panic "result must be >= lo"
    assert it <= hi panic "result must be <= hi"
} scope {
    if x < lo { return lo }
    if x > hi { return hi }
    return x
}

test "clamp within range" {
    assert clamp(5, 0, 10) == 5 panic "5 is already in range"
}

test "clamp below minimum" {
    assert clamp(-5, 0, 10) == 0 panic "below the range clamps to lo"
}

test "clamp above maximum" {
    assert clamp(15, 0, 10) == 10 panic "above the range clamps to hi"
}`,
  },
  {
    title: 'Collections',
    code: `module playground

import std.io
import std.container.list
import std.container.set

func main() {
    // A literal builds whatever collection its context asks for
    fin numbers: List<Int> = [1, 2, 3, 4, 5]
    println("List size: \${numbers.size}")

    // A set keeps one of each element
    fin unique: Set<Int> = [1, 2, 2, 3, 3, 3]
    println("Set size: \${unique.size}")

    // An untyped [key: value] literal is the standard map
    var ages = ["Ada": 36, "Linus": 28]
    ages["Grace"] = 45
    println("Map size: \${ages.size}")
}`,
  },
  {
    title: 'Metaprogramming',
    code: `module playground

import std.io

// \`annot\` declares a decorator; \`for\` says what it may decorate.
annot @Range for .Pack {
    fin min: Int
    fin max: Int
}

annot @Tracked for .Pack

@Tracked
@Range(min: 0, max: 100)
pack Health {
    var value: Int = 50
}

func main() {
    // Compile-time introspection: reflect over a declaration and ask about it.
    inline if reflect<Health>.hasAnnot<Tracked> {
        println("Health is tracked")
    }

    inline if reflect<Health>.hasAnnot<Range> {
        inline fin minVal = reflect<Health>.annotMeta<Range>.min
        inline fin maxVal = reflect<Health>.annotMeta<Range>.max
        println("Health range: \${minVal}..\${maxVal}")
    }
}`,
  },
  {
    title: 'Pointers & Memory',
    code: `module playground

import std.io

pack Node {
    var value: Int
    var next: Node^? = null
}

func main() {
    // alloc^ places a value on the heap and hands back a writable pointer
    var c: Node^ = alloc^ Node(3)
    var b: Node^ = alloc^ Node(2, c)
    var a: Node^ = alloc^ Node(1, b)

    // Traverse the linked list: a -> b -> c
    var current: Node^? = a
    while current != null {
        println((*current).value)
        current = (*current).next
    }

    purge a
    purge b
    purge c
}`,
  },
  {
    title: 'Dependency Injection',
    code: `module playground

import std.io

// Singleton services are \`solo\` packs
solo pack Logger {
    var level: Int = 1
}

impl Logger {
    func &.log(msg: String) {
        if self.level > 0 {
            println("[LOG] \${msg}")
        }
    }
}

solo pack Database {
    var connected: Bool = false
}

impl Database {
    func !.connect() {
        self.connected = true
        println("Database connected")
    }

    func &.query(sql: String): String {
        if !self.connected { return "not connected" }
        return "result for: " + sql
    }
}

// The graph wires every singleton the program can inject
graph AppGraph {
    solo Logger()
    solo Database()
}

func main() {
    fin logger = inject Logger
    var db = inject Database

    logger.log("Starting app")
    db.connect()
    logger.log(db.query("SELECT * FROM users"))
}`,
  },
  {
    title: 'Reactivity',
    code: `module playground

import std.io

// \`remember\` state survives each rerun of its reactive owner
react func counter() {
    remember var count: Int = 0
    count = count + 1
    println("Call #\${count}")
}

react func greeting(name: String) {
    remember var visits: Int = 0
    visits = visits + 1

    // An effect reruns when what it reads changes
    effect name {
        println("Hello, \${name}! Visited \${visits} time(s)")
    }
}

react func main() {
    counter()
    greeting("Azora")
}`,
  },
];
