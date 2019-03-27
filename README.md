# MMM_

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/mcgingras/Deploy_MMM)

The Market Making Machine is a A UI for creating and managing market making strategies on top of Veil.

### Instructions
Simply click the 'deploy to heroku' button to spin up an instance of the Market Making Machine.

- Spread
- Amount
- Target

### Strategies

##### Simple
Simple strategy places a spread around the given target.

##### EMA
Exponential moving average.

##### LSMR
:0

##### Other

## Todo:
- Check when markets expire. Sometimes market will expire and then editing strategy shows no market, because it is no longer in the list. Do we want to expire the entire market? Or what?
- Show position (do we want to create a class for orders?)
- Improve error message handling
- Improve other strategies
