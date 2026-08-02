export const codeExamples = [
  {
    title: 'Hello World',
    code: `use std.io

func main() {
    std::println("Hello, world!")
}`,
  },
  {
    title: 'Variables',
    code: `use std.io

func main() {
    // Mutable binding
    var count = 0

    // Immutable binding
    fin name = "Azora"
    fin greeting = "Hello, \${name}!"

    // Stdlib collections are Kotlin-inspired
    fin items = vec@[1, 2, 3, 4, 5]
    count = items.size

    std::println(greeting)
    trace { "\${count}" }
}`,
  },
  {
    title: 'Functions & Lambdas',
    code: `use std.io

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
    std::println("\${add(3, 4)}")
    std::println("\${square(5)}")

    // Lambda
    fin double = { x: Int -> x * 2 }
    std::println("\${apply(5, double)}")
}`,
  },
  {
    title: 'Tuples',
    code: `use std.io
use std.container.tuple

func divmod(a: Int, b: Int): (Int, Int) {
    return tup@(a / b, a % b)
}

func main() {
    // Tuple literal
    fin pair = tup@(42, "hello")
    std::println("\${pair.0}")
    std::println(pair.1)

    // Tuple as return value
    fin result = divmod(17, 5)
    std::println("quotient: \${result.0}")
    std::println("remainder: \${result.1}")

    // Nested tuple
    fin nested = tup@(1, tup@(2, 3), "end")
    fin inner = nested.1
    std::println("\${inner.0}")
}`,
  },
  {
    title: 'Packs & Enums',
    code: `use std.io

pack Point {
    var x: Real
    var y: Real
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
    std::println("Distance squared: \${dx * dx + dy * dy}")

    fin dir = Direction.North
    std::println("\${dir}")
}`,
  },
  {
    title: 'Slots',
    code: `use std.io

slot Shape {
    Circle(radius: Real)
    Rectangle(width: Real, height: Real)
    Point
}

func describe(shape: Shape): String {
    return when shape {
        Shape.Circle(radius) -> "circle with r=\${radius}"
        Shape.Rectangle(width, height) -> "rect \${width}x\${height}"
        else -> "point"
    }
}

func main() {
    fin c = Shape.Circle(5.0)
    fin r = Shape.Rectangle(3.0, 4.0)

    std::println(describe(c))
    std::println(describe(r))
}`,
  },
  {
    title: 'Generics',
    code: `use std.io

pack Pair<A, B> {
    var first: A
    var second: B
}

func swap<A, B>(pair: Pair<A, B>): Pair<B, A> {
    return Pair(pair.second, pair.first)
}

func main() {
    fin p = Pair<String, Int>("hello", 42)
    std::println("\${p.first}, \${p.second}")

    fin s = swap<String, Int>(p)
    std::println("\${s.first}, \${s.second}")
}`,
  },
  /*{
    title: 'Async / Await',
    code: `use std.io

async func main() {
    // \`async { … }\` starts work; the handle is awaited for its result.
    fin a = async { "Hello, Alice!" }
    fin b = async { "Hello, Bob!" }

    // Await both results
    std::println(await a)
    std::println(await b)
}`,
  },*/
  {
    title: 'Flows',
    code: `use std.io
use std.concurrency.generators

// A producer stays an ordinary \`func\`; its return type says it yields a stream.
func range(n: Int): std::Sequence<Int> = std::sequence([s: std::SequenceScope<Int>!]{
    for i in 0..<n {
        std::yield(i)
    }
})

func evens(n: Int): std::Sequence<Int> = std::sequence([s: std::SequenceScope<Int>!]{
    for i in 0..<n {
        if i % 2 == 0 {
            std::yield(i)
        }
    }
})

func main() {
    var sum = 0
    range(5).collect({ x -> sum = sum + x })
    std::println("Sum 0..<5: \${sum}")

    evens(10).collect({ e -> std::println("\${e}") })
}`,
  },
  {
    title: 'Testing',
    code: `func factorial(n: Int): Int {
    if n <= 1 { return 1 }
    return n * factorial(n - 1)
}

test "factorial of 0 is 1" {
    assert factorial(0) == 1
}

test "factorial of 5 is 120" {
    assert factorial(5) == 120
}

test "factorial of 1 is 1" {
    assert factorial(1) == 1
}`,
  },
  {
    title: 'Error Handling',
    code: `use std.io

fail MathError {
    DivisionByZero
    Overflow
}

func safeDivide(a: Int, b: Int): Int ?! MathError {
    if b == 0 { return .DivisionByZero }
    return a / b
}

func main() {
    // Catch with default value
    fin result = safeDivide(10, 0) catch -1
    std::println("10 / 0 = \${result}")

    // Successful division
    fin ok = safeDivide(10, 2) catch 0
    std::println("10 / 2 = \${ok}")
}`,
  },
  {
    title: 'Contracts',
    code: `func clamp(x: Int, lo: Int, hi: Int): Int
in {
    assert lo <= hi { "lo must be <= hi" }
} out {
    assert it >= lo { "result must be >= lo" }
    assert it <= hi { "result must be <= hi" }
} zone {
    if x < lo { return lo }
    if x > hi { return hi }
    return x
}

test "clamp within range" {
    assert clamp(5, 0, 10) == 5
}

test "clamp below minimum" {
    assert clamp(-5, 0, 10) == 0
}

test "clamp above maximum" {
    assert clamp(15, 0, 10) == 10
}`,
  },
  {
    title: 'Collections',
    code: `use std.io

func main() {
    fin numbers = vec@[1, 2, 3, 4, 5]
    std::println("List size: \${numbers.size}")

    // setOf deduplicates
    fin unique = set@[1, 2, 2, 3, 3, 3]
    std::println("Set size: \${unique.size}")
}`,
  },
  /*{
    title: 'Metaprogramming',
    code: `use std.io

deco Range {
    fin min: Int
    fin max: Int
}

deco Serializable

@Serializable
@Range(min: 0, max: 100)
pack Health {
    var value: Int = 50
}

func main() {
    // Compile-time introspection: reflect over a declaration and ask about it.
    inline if std::reflect<Health>.hasDeco<Serializable> {
        std::println("Health is serializable")
    }

    inline if std::reflect<Health>.hasDeco<Range> {
        inline fin minVal = std::reflect<Health>.decoMeta<Range>.min
        inline fin maxVal = std::reflect<Health>.decoMeta<Range>.max
        std::println("Health range: \${minVal}..\${maxVal}")
    }
}`,
  },*/
  {
    title: 'Pointers & Memory',
    code: `use std.io

pack Node {
    var value: Int
    var next: Node* = null
}

func main() {
    // Heap allocation
    var a = alloc Node(value: 1, next: null)
    var b = alloc Node(value: 2, next: null)
    var c = alloc Node(value: 3, next: null)

    // Link nodes: a -> b -> c
    a.*.next = b
    b.*.next = c

    // Traverse the linked list
    var current: Node* = a
    while current != null {
        std::println("\${current.*.value}")
        current = current.*.next
    }
}`,
  },
  {
    title: 'Dependency Injection',
    code: `use std.io

// Singleton services with solo
solo Logger {
    var level: Int = 1

    func log[self: Self&](msg: String) {
        if self.level > 0 {
            std::println("[LOG] \${msg}")
        }
    }
}

solo Database {
    var connected: Bool = false

    func connect[self: Self!]() {
        self.connected = true
        std::println("Database connected")
    }

    func query[self: Self&](sql: String): String {
        if !self.connected { return "not connected" }
        return "result for: " + sql
    }
}

// DI container wiring
wrap AppModule {
    solo Logger
    solo Database
}

func main() {
    // Resolve singletons from the active wrap
    var logger = inject Logger
    fin db = inject Database
    logger.level = 1

    logger.log("Starting app")
    db.connect()
    fin result = db.query("SELECT * FROM users")
    logger.log(result)
}`,
  },
  {
    title: 'Reactivity',
    code: `// Persistent state with rem
@Reactive
func counter() {
    ret count: Int = 0
    count = count + 1
    trace { "Call #\${count}" }
}

// Reactive views
@Reactive
func Greeting(name: String) {
    ret visits: Int = 0
    visits = visits + 1

    trace .Info "Hello, \${name}!"
    trace .Info "Visited \${visits} times"

    // Side effects that track dependencies
    effect name {
        trace .Warn "Name changed to: \${name}"
    }
}

@Reactive
func main() {
    // rem persists across calls
    counter()   // Call #1
    counter()   // Call #2
    counter()   // Call #3
}`,
  },
];
