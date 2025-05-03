package com.example.notepadx.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "files")
@Getter
@Setter
public class File {
    @Id
    private String id;
    private String name;
    private String content;
    private String parentId;
}