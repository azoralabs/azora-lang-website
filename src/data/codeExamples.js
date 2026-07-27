export const codeExamples = [
  {
    title: 'Hello World',
    code: `import std.io

func main() {
    std::println("Hello, world!")
}`,
  },
  {
    title: 'Variables',
    code: `import std.io

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
    code: `import std.io

// Named function with return type
func add(a: Int, b: Int): Int {
    return a + b
}

// Single-expression function
func square(x: Int): Int = x * x

// Higher-order function
func apply(value: Int, transform: Func(Int) -> Int): Int {
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
    code: `import std.io
import std.container.tuple

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
    code: `import std.io

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
    code: `import std.io

slot Shape {
    Circle(radius: Real)
    Rectangle(width: Real, height: Real)
    Point
}

func describe(shape: Shape): String {
    return when shape {
        is .Circle -> "circle with r=\${shape.radius}"
        is .Rectangle -> "rect \${shape.width}x\${shape.height}"
        is .Point -> "point"
    }
}

func main() {
    fin c = Shape.Circle(5.0)
    fin r = Shape.Rectangle(3.0, 4.0)

    println(describe(c))
    println(describe(r))
}`,
  },
  {
    title: 'Generics',
    code: `import std.io

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
    code: `task main() {
    fin a = task { "Hello, Alice!" }
    fin b = task { "Hello, Bob!" }

    // Await both results
    println(await a)
    println(await b)
}`,
  },*/
  {
    title: 'Flows',
    code: `import std.io

flow range(n: Int): Int {
    for i in 0..n {
        yield i
    }
}

flow evens(n: Int): Int {
    for i in 0..n {
        if i % 2 == 0 {
            yield i
        }
    }
}

task main() {
    var sum = 0
    for x in range(5) {
        sum = sum + x
    }
    std::println("Sum 0..5: \${sum}")

    for e in evens(10) {
        std::println("\${e}")
    }
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
    code: `import std.io

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
    code: `import std.io

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
    code: `deco Range {
    fin min: Int
    fin max: Int
}

deco Serializable

@Serializable
@Range(min = 0, max = 100)
fin health: Int = 50

// Compile-time introspection using deepinline
deepinline {
    if hasDeco(health, Serializable) {
        trace { "health is serializable" }
    }

    if hasDeco(health, Range) {
        fin minVal = getDeco(health, Range, min)
        fin maxVal = getDeco(health, Range, max)
        trace { "health range: \${$minVal}..\${$maxVal}" }
    }
}

func main() {
    trace "Health: \${health}"
}`,
  },*/
  {
    title: 'Pointers & Memory',
    code: `import std.io

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
    (deref a).next = b
    (deref b).next = c

    // Traverse the linked list
    var current: Node* = a
    while current != null {
        std::println((deref current).value)
        current = (deref current).next
    }

    // Cleanup
    drop c
    drop b
    drop a
}`,
  },
  {
    title: 'Dependency Injection',
    code: `// Singleton services with solo
solo Logger {
    var level: Int = 1

    func log(msg: String) {
        if level > 0 {
            trace "[LOG] $msg"
        }
    }
}

solo Database {
    var connected: Bool = false

    func connect() {
        connected = true
        trace "Database connected"
    }

    func query(sql: String): String {
        if !connected { return "not connected" }
        return "result for: " + sql
    }
}

// DI container wiring
wrap AppModule {
    solo Logger
    solo Database
}

func main() {
    // Start the DI container lifecycle
    AppModule.initLifecycle()

    // Resolve singletons from the active wrap
    fin logger = inject Logger
    fin db = inject Database

    logger.log("Starting app")
    db.connect()
    fin result = db.query("SELECT * FROM users")
    logger.log(result)

    // End lifecycle, runs solo destructors
    AppModule.endLifecycle()
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
