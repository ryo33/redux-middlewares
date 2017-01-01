# redux-middlewares
A library to create middlewares.

It fits to prototyping or small projects.

## Install
Note: It has not been published yet.
```bash
$ npm install -S redux-middlewares
```

## API
- [x] [createMiddleware(matcher, callback)](#createmiddlewarematcher-callback)
- [ ] createFilter(matcher, [filter])
- [ ] createTransformer(matcher, [filter], transformer)
- [ ] createReplacer(matcher, [filter], replacer)

### createMiddleware(matcher, callback)
Calls the given callback only the action is matched.

- `matcher` string | array | (action => bool)
  - **string** An action type to match
  - **array** An array of action types to match
  - **action => bool** A function returns true if matched
- `callback` ({getState, dispatch, nextDispatch, action}) => any

