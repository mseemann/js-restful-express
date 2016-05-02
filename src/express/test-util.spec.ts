import {expect} from 'chai';

function checkHttpStatus(err, res, done){
    if (err) return done(err);
    expect(res.status).to.equal(200);
}

export function checkDefaultsJson(err, res, done){
    checkHttpStatus(err, res, done);
    expect(res.header).to.contain({'content-type': 'application/json; charset=utf-8'});
}

export function checkDefaultsText(err, res, done){
    checkHttpStatus(err, res, done);
    expect(res.header).to.contain({'content-type': 'text/plain; charset=utf-8'});
}