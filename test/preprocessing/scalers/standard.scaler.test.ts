import { assert } from 'chai'
import { StandardScaler } from '../../../dist'
import { Series, DataFrame } from 'danfojs-node'

describe('StandardScaler', function () {
  it('StandardScaler works for DataFrame', function () {
    const data = [
      [0, 0],
      [0, 0],
      [1, 1],
      [1, 1],
    ]

    const scaler = new StandardScaler()
    scaler.fit(new DataFrame(data))

    const expected = [
      [-1, -1],
      [-1, -1],
      [1, 1],
      [1, 1],
    ]
    const resultDf = scaler.transform(new DataFrame(data)) as DataFrame
    assert.deepEqual(resultDf.values, expected)
    assert.deepEqual(scaler.transform([[2, 2]]) as any, [[3, 3]])
  })
  it('fitTransform works for StandardScaler', function () {
    const data = [
      [0, 0],
      [0, 0],
      [1, 1],
      [1, 1],
    ]

    const scaler = new StandardScaler()
    const resultDf = scaler.fitTransform(new DataFrame(data)) as DataFrame

    const expected = [
      [-1, -1],
      [-1, -1],
      [1, 1],
      [1, 1],
    ]
    assert.deepEqual(resultDf.values, expected)
  })
  it('inverseTransform works for StandardScaler', function () {
    const data = [
      [0, 0],
      [0, 0],
      [1, 1],
      [1, 1],
    ]

    const scaler = new StandardScaler()
    scaler.fit(new DataFrame(data))
    const resultDf = scaler.inverseTransform([
      [-1, -1],
      [-1, -1],
      [1, 1],
      [1, 1],
    ]) as any

    assert.deepEqual(resultDf, data)
  })
  it('StandardScaler works for Array', function () {
    const data = [
      [0, 0],
      [0, 0],
      [1, 1],
      [1, 1],
    ]

    const scaler = new StandardScaler()
    scaler.fit(data)
    const expected = [
      [-1, -1],
      [-1, -1],
      [1, 1],
      [1, 1],
    ]

    assert.deepEqual(scaler.transform(data) as any, expected)
    assert.deepEqual(scaler.transform([[2, 2]]) as any, [[3, 3]])
  })

  it('StandardScaler works for Series', function () {
    const data = [0, 0, 0, 0, 1, 1, 1, 1]

    const scaler = new StandardScaler()
    scaler.fit(new Series(data))
    const expected = [-1, -1, -1, -1, 1, 1, 1, 1]

    assert.deepEqual(
      (scaler.transform(new Series(data)) as Series).values,
      expected
    )
    assert.deepEqual(scaler.transform([2, 2]), [3, 3])
  })

  it('StandardScaler works with constant column', function () {
    const data = [1, 1, 1, 1, 1, 1, 1, 1]

    const scaler = new StandardScaler()
    scaler.fit(data)
    const expected = [0, 0, 0, 0, 0, 0, 0, 0]

    assert.deepEqual(scaler.transform(data), expected)
  })
  it('StandardScaler plays nice with Nan', function () {
    const scaler = new StandardScaler()
    scaler.fit([1, 1, 1, 1, 'NaN', 1, 1, 1] as any)

    assert.deepEqual(scaler.transform([1, 1, 1] as any), [0, 0, 0])
  })
})
