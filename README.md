# redux-middlewares
A library to create middlewares.

It fits to prototyping or small projects.

## Install
```bash
$ npm install -S redux-middlewares
```

## API
- [composeMiddleware(...middlewares)](#composemiddlewaremiddlewares)
- [createMiddleware(...matchers, callback)](#createmiddlewarematchers-callback)
- [createFilter(...matchers, filter)](#createfiltermatchers-filter)
- [createTransformer(...matchers, transformer)](#createtransformermatchers-transformer)
- [createReplacer(...matchers, replacer)](#createreplacermatchers-replacer)

### composeMiddleware(...middlewares)
It works like Redux's `applyMiddleware` but returns a middleware instead of a store enhancer.

### createMiddleware(...matchers, callback)
Calls the given callback only an action is matched to all matchers.

By caching, it does not call `store.getState` more than once at matching.  
All other `create*` functions use this function internally.  

- `matcher` string | array | ({action, getState}) => boolean
  - **string** An action type to match
  - **array** An array of action types to match
  - **({action, getState}) => boolean** A function returns true if matched
- `callback` ({getState, dispatch, nextDispatch, action}) => any

### createFilter(...matchers, filter)
Filters actions.

It calls `nextDispatch` if the filter returns true.  

- `filter` ({action, getState}) => boolean

### createTransformer(...matchers, transformer)
Transforms an action in the middleware layer.

- `transformer` ({action, getState}) => action

### createReplacer(...matchers, replacer)
Discards an action and dispatch a new one.

- `replacer` ({action, getState}) => action
