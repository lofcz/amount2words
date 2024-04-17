namespace Atw.Tests;

public class Tests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    [TestCase(5800, "pět tisíc osm set korun českých")]
    [TestCase(1000, "jeden tisíc korun českých")]
    [TestCase(1, "jedna koruna česká")]
    [TestCase(4, "čtyři koruny české")]
    [TestCase(12, "dvanáct korun českých")]
    [TestCase(10584, "deset tisíc pět set osmdesát čtyři korun českých")]
    [TestCase(420584, "čtyři sta dvacet tisíc pět set osmdesát čtyři korun českých")]
    public void TestCz(int n, string expected)
    {
        string str = Atw.AmountToWords(n);
        Assert.That(str, Is.EqualTo(expected));
    }
    
    [Test]
    [TestCase(5800, "pět tisíc osm set")]
    [TestCase(1000, "jeden tisíc")]
    [TestCase(1, "jedna")]
    [TestCase(4, "čtyři")]
    public void TestNoCurr(int n, string expected)
    {
        string str = Atw.AmountToWords(n, Atw.Languages.Cz, Atw.Currencies.None);
        Assert.That(str, Is.EqualTo(expected));
    }
}