package org.example;

import java.util.Objects;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import com.owlike.genson.annotation.JsonProperty;

@DataType()
public final class Document {

    @Property()
    private final String documentID;

    @Property()
    private final String creatorID;

    @Property()
    private final String documentName;

    @Property()
    private final String documentHash;

    @Property()
    private final String docType;

    public String getDocType() {
        return docType;
    }

    public String getDocumentID() {
        return documentID;
    }

    public String getCreatorID() {
        return creatorID;
    }

    public String getDocumentName() {
        return documentName;
    }

    public String getDocumentHash() {
        return documentHash;
    }
    


    /*
    Constructor
    */
    public Document(@JsonProperty("documentID") final String documentID,@JsonProperty("creatorID") final String creatorID, 
                    @JsonProperty("documentName") final String documentName,@JsonProperty("documentHash") final String documentHash,
                    @JsonProperty("docType") final String docType){
        
        this.documentID = documentID;
        this.creatorID = creatorID;
        this.documentName = documentName;
        this.documentHash = documentHash;
        this.docType = docType;
        
    }

    @Override
    public boolean equals(final Object obj) {
        if(this == obj){
            return true;
        }

        if ((obj == null) || (getClass() != obj.getClass())) {
            return false;
        }

        Document other = (Document) obj;

        return Objects.deepEquals(
            new String[]{getDocumentID(), getCreatorID(), getDocumentName(), getDocumentHash(), getDocType()},
            new String[]{other.getDocumentID(), other.getCreatorID(), other.getDocumentName(), other.getDocumentHash(), other.getDocType()}
    );
        
        
    }

    @Override
    public int hashCode() {
        
        return Objects.hash(getDocumentID(), getCreatorID(), getDocumentName(), getDocumentHash(), getDocType());
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() + "@" + Integer.toHexString(hashCode()) + " [documentID=" + getDocumentID() 
                + ", creatorID=" + getCreatorID() + ", documentName=" + getDocumentName() 
                + ", documentHash=" + getDocumentHash() + ", docType=" + getDocType() + "]";
    }
    


    


}