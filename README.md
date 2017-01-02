# redux-middlewares
A library to create middlewares.

It fits to prototyping or small projects.

## Install
Note: It has not been published yet.
```bash
$ npm install -S redux-middlewares
```

## API
- [createMiddleware(...matchers, callback)](#createmiddlewarematchers-callback)
- [createFilter(...matchers, filter)](#createfiltermatchers-filter)
- [createTransformer(...matchers, transformer)](#createtransformermatchers-transformer)
- [createReplacer(...matchers, replacer)](#createreplacermatchers-replacer)

### createMiddleware(...matchers, callback)
Calls the given callback only an action is matched to all matchers.

By caching, it does not call `store.getState` more than once at matching.  
All other middleware generators use this function internally.  

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
