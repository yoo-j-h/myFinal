package com.kh.ct.global.exception;

import lombok.Getter;

@Getter
public class EmpNoConflictException extends RuntimeException {
    private final String newEmpNo;

    public EmpNoConflictException(String message, String newEmpNo) {
        super(message);
        this.newEmpNo = newEmpNo;
    }
}
