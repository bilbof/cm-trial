# Autogenerate trial data for your customers in ChartMogul.

## Links

- [Learn more about trialling customers in ChartMogul](https://help.chartmogul.com/hc/en-us/articles/210547889)
- [Visit the trialling customers documentation](https://dev.chartmogul.com/v1.0/docs/tracking-leads-and-free-trials-using-the-api)

## Usage

1. Download, CD, install dependencies

```
git clone https://github.com/bilbof/cm-trial
cd cm-trial
npm install
```

2. Add ChartMogul API keys ([found here](https://app.chartmogul.com/#admin/api))

```
var auth = {
	token: "123",
	key: "456"
};
```

3. Run

```
node index.js
```
